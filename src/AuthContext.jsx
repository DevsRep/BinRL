import { createContext, useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { auth } from './firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updatePassword } from 'firebase/auth';


const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);


    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    function register(email, password, name) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function refreshUser() {
        return auth.currentUser.reload();
    }

    function updateUserPassword(newPassword) {
        return auth.currentUser.updatePassword(newPassword);
    }

    function getToken() {
        return auth.currentUser.getIdToken();
    }


    const value = {
        currentUser,
        login,
        logout,
        register,
        refreshUser,
        getToken,
        updateUserPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );


}