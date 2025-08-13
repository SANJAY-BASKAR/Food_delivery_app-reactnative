import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import dummyData from "./data";

interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[]; // list of customization names
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
    const list = await databases.listDocuments(
        appwriteConfig.databaseId,
        collectionId
    );

    await Promise.all(
        list.documents.map((doc) =>
            databases.deleteDocument(appwriteConfig.databaseId, collectionId, doc.$id)
        )
    );
}

async function clearStorage(): Promise<void> {
    const list = await storage.listFiles(appwriteConfig.bucketId);

    await Promise.all(
        list.files.map((file) =>
            storage.deleteFile(appwriteConfig.bucketId, file.$id)
        )
    );
}

async function uploadImageToStorage(imageUrl: string) {
    const placeholderUrl = "https://via.placeholder.com/400x300?text=No+Image";

    // Prevent infinite recursion
    if (imageUrl === placeholderUrl) {
        return placeholderUrl;
    }

    try {
        // Use a CORS proxy to bypass cross-origin restrictions
        const corsProxy = "https://cors-anywhere.herokuapp.com/";
        const response = await fetch(corsProxy + imageUrl, {
            headers: {
                'Origin': 'http://localhost:8081'
            }
        });

        if (!response.ok) {
            console.warn(`Failed to fetch ${imageUrl}, using placeholder`);
            return placeholderUrl;
        }

        const blob = await response.blob();

        if (blob.size === 0) {
            console.warn(`Empty blob for ${imageUrl}, using placeholder`);
            return placeholderUrl;
        }

        // Convert blob to base64 using FileReader for better compatibility
        const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                // Extract just the base64 part from data URL
                const base64Data = result.split(',')[1];
                resolve(base64Data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });

        const fileObj = {
            name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
            type: blob.type || "image/jpeg",
            size: blob.size,
            uri: `data:${blob.type || "image/jpeg"};base64,${base64}`,
        };

        const uploadedFile = await storage.createFile(
            appwriteConfig.bucketId,
            ID.unique(),
            fileObj
        );

        return storage.getFileViewURL(appwriteConfig.bucketId, uploadedFile.$id);
    } catch (error) {
        console.error(`Error uploading ${imageUrl}:`, error);
        return placeholderUrl;
    }
}

async function seed(): Promise<void> {
    // 1. Clear all
    await clearAll(appwriteConfig.categoriesCollectionId);
    await clearAll(appwriteConfig.customizationsCollectionId);
    await clearAll(appwriteConfig.menuCollectionId);
    await clearAll(appwriteConfig.menuCustomizationsCollectionId);
    await clearStorage();

    // 2. Create Categories
    const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
        const doc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId,
            ID.unique(),
            cat
        );
        categoryMap[cat.name] = doc.$id;
    }

    // 3. Create Customizations
    const customizationMap: Record<string, string> = {};
    for (const cus of data.customizations) {
        const doc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.customizationsCollectionId,
            ID.unique(),
            {
                name: cus.name,
                price: cus.price,
                type: cus.type,
            }
        );
        customizationMap[cus.name] = doc.$id;
    }

    // 4. Create Menu Items
    const menuMap: Record<string, string> = {};
    for (const item of data.menu) {
        const uploadedImage = await uploadImageToStorage(item.image_url);

        const doc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            ID.unique(),
            {
                name: item.name,
                description: item.description,
                image_url: uploadedImage,
                price: item.price,
                rating: item.rating,
                calories: item.calories,
                protein: item.protein,
                categories: categoryMap[item.category_name],
            }
        );

        menuMap[item.name] = doc.$id;

        // 5. Create menu_customizations
        for (const cusName of item.customizations) {
            await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.menuCustomizationsCollectionId,
                ID.unique(),
                {
                    menu: doc.$id,
                    customizations: customizationMap[cusName],
                }
            );
        }
    }

    console.log("✅ Seeding complete.");
}

export default seed;