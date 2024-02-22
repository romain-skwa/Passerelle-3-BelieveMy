import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "./firebase";

export const AuthContext = createContext(null); // on crée un contexte

const AuthProvider = ({children}) => { // qq chose qu'on pourra appeler et qui va entourer l'ensemble de notre projet
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { // on va détecter si l'utilisateur est connecté ou non
    onAuthStateChanged(auth, (currentUser) =>{
        setUser(currentUser); // s'il n'y a pas d'utilisateur, setUser sera vide. autrement, il y aura l'utilisateur connecté.
        setLoading(false); // on va avoir un setLoading(false) lorsque onAuthStateChanged va être passé à notre utilisateur et qu'on saura si l'utilisateur est connecté ou non
    });
  }, [])

  /*  Pour déconnecter notre utilisateur, on crée notre fonction logOut  */

  // Function
  const logOut = () =>{
    return signOut(auth) /* signOut qui vient firebase/auth . Ça va retirer notre cookie et nous déconnecter de notre session firebase*/
  }

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }
  const loginUser = (email, password) =>{
    return signInWithEmailAndPassword(auth, email, password)
  }

  const authValue = {
    user,
    loading,
    logOut,
    createUser,
    loginUser,
  };

  /*
  On retourne notre provider
  Pour ça, on retourne le authContext qui est à la ligne 5
  .Provider parce qu'on utilise createContext
  On va devoir utiliser une valeur qu'on appelle authValue
  Cette valeur sera utilisée dans les composants qu'on va avoir : children
  */
 
  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
};

export default AuthProvider;
