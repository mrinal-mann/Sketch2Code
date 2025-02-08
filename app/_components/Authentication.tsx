"use client"
import { auth } from '@/configs/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React from 'react'

function Authentication({ children }: any) {
    const provider = new GoogleAuthProvider();

    const onButtonPress = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential: any = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log('User signed in:', user);
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData?.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.error('Error during sign-in:', errorCode, errorMessage, email, credential);
                alert(`Error during sign-in: ${errorMessage}`);
            });
    }

    return (
        <div>
            <div onClick={onButtonPress}>
                {children}
            </div>
        </div>
    )
}

export default Authentication