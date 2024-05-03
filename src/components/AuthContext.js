import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase-config'; // Asumując, że konfiguracja Firebase jest odpowiednio zaimportowana
import { signOut } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
        });
        return unsubscribe;
    }, []);

    const logout = () => {
        signOut(auth).catch(error => console.error('Error logging out:', error));
    };

    const value = {
        currentUser,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}