import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";

export const AuthContext =  createContext(null);

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, (currenUser) => {
            setUser(currenUser);
            setLoading(false);
        })
    }, [])

    // Function
    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    const loginUser = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const authValue = {
        user,
        loading,
        logOut,// pour déconnecter notre utilisateur de n'importe où
        loginUser,
    }
    // On retourne authContext. Il faut utiliser une valeur qui pourra être utiliser dans children
    return <AuthContext.Provider value={authValue}>
                {children}
            </AuthContext.Provider>
};

export default AuthProvider;