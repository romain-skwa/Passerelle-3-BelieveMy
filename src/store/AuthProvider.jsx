import { onAuthStateChanged } from "firebase/auth";
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

    const authValue = {
        user,
        loading,
    }
    // On retourne authContext. Il faut utiliser une valeur qui pourra être utiliser dans children
    return <AuthContext.Provider value={authValue}>
                {children}
            </AuthContext.Provider>
};

export default AuthProvider;