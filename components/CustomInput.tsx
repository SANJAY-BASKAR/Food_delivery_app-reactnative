import {View, Text, TextInput} from 'react-native'
import React, {useState} from 'react'
import {CustomInputProps} from "@/type";
import cn from "clsx";


const CustomInput = ({
                         placeholder ='entry text',
                         value,
                         onChangeText,
                         label,
                         secureTextEntry = false,
                         keyboardType = 'default'
                     }: CustomInputProps) => {
    // currently we are typing within it or not to check we add
    const [isFocused, setIsFocused] = useState(false);



    return (
        <View className="w-full">
            <Text className="label">{label}</Text>
            <TextInput
                autoCorrect={false}
                autoCapitalize="none"
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                placeholderTextColor="#888"
                className={cn('input', isFocused ? 'border-primary' : 'border-gray-300')}/>

        </View>
    )
}
export default CustomInput
