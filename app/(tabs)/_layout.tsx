import React from 'react'
import {Redirect, Slot} from "expo-router";

const _Layout = () => {
    const isAuthenticated = true; // Dummy check - change to true to disable redirect

    if(!isAuthenticated) return <Redirect href="/(auth)/sign-in" />
    return <Slot />
}

export default _Layout;
