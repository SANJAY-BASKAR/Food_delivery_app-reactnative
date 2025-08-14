import CustomButton from '@/components/CustomButton'
import useAuthStore from '@/store/auth.store'
import { router } from 'expo-router'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {
    const { logout } = useAuthStore()

    const handleLogout = async () => {
        try {
            await logout()
            router.replace('/(auth)/sign-in')
        } catch (error) {
            console.log('Logout failed:', error)
        }
    }

    return (
        <SafeAreaView className='flex justify-center items-center h-full'>
            <CustomButton title="Log Out" onPress={handleLogout} />
        </SafeAreaView>
    )
}
export default Profile
