import { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from 'lib/firebase/config';

const availableScopes = [
    {
        name: 'Drive - Read Only',
        scopes: [
            'https://www.googleapis.com/auth/drive.readonly',
        ]
    },
    {
        name: 'Drive - Read/Write',
        scopes: [
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file',
        ]
    },
    {
        name: 'Google Analytics - Read Only',
        scopes: [
            'https://www.googleapis.com/auth/analytics.readonly',
        ]
    },
]

export const useGoogleApiAuth = ( scopes='Drive - Read Only' ) => {
    const [authToken, setAuthToken] = useState(null);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);

    const googleApiSignIn = async () => {
        try {
            
            setIsPending(true);

            const scopeList = availableScopes.find(scope => scope.name === scopes).scopes;
            const provider = new GoogleAuthProvider();
            
            // setCustomParameters method of the GoogleAuthProvider class to specify the prompt parameter, which controls how the sign-in process is triggered. 
            // For example, setting the prompt parameter to select_account will always prompt the user to select an account, even if they are already signed in:
            provider.setCustomParameters({ prompt: 'select_account' });
            provider.addScope(scopeList.join(' '));

            const result = await signInWithPopup(auth, provider);
            setAuthToken(result._tokenResponse.oauthAccessToken);
            
        } catch (error) {
            setError(error);
        } finally {
            setIsPending(false);
        }
    };

    const signOut = () => {
        auth.signOut();
        setAuthToken(null);
    };
    
    return { 
        authToken, 
        error, 
        isPending, 
        googleApiSignIn,
        signOut 
    };
};