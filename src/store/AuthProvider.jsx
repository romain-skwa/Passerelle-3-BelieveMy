import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { toast } from "react-toastify";

export const AuthContext =  createContext(null);

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null); //console.log(`Dans le contexte, le contenu de user : `, user)
    const [loading, setLoading] = useState(true);

    const [userList, setUserList] = useState(null); //informations concernant TOUS les utilisateurs 
    // Données concernant l'utilisateur connecté
    const [idOfConnectedUser, setIdOfConnectedUser] = useState(null);
    const [pseudonymConnectedUser, setPseudonymConnectedUser] = useState(null);
    const [mailOfConnectedUser, setMailOfConnectedUser] = useState(null);
    const [followListOfConnectedUser, setFollowListOfConnectedUser] = useState(null);
    const [likedListOfConnectedUser, setLikedListOfConnectedUser] = useState(null);
    const [avatartOfTheConnectedUser, setAvatartOfTheConnectedUser] = useState([]);
    const [mailInterlocutor, setMailInterlocutor] = useState("");// Destinataire
    const [forUpdateMessageReadStatus, setForUpdateMessageReadStatus] = useState();

    // Donnée qui désigne le destinaire lors de l'envoi d'un message
    const [toTheMail, setToTheMail] = useState("none");// Destinataire
    //Ensemble des commentaires

/* ----------------------------------------------------------------------------------------------
actualiserListFollow est une fonction qui va actualiser followListOfConnectedUser 
Grace au contexte, cette fonction sera exécutée depuis le composant FollowThisUser
A chaque fois que l'utilisateur cliquera sur le bouton "S'abonner", la liste des auteurs suivis présente dans firebase
sera actualisée ici dans le contexte.
Et à chaque fois, la liste des tweets sera réaffichée avec les éventuels changements.*/
const actualiserListFollow = (x) => {
  setFollowListOfConnectedUser(x);
}
/*---------------------------------------------------------------------------------------------- */
// Équivalent dans le fichier Liked.jsx
const actualiserLikedList = (y) => {
  setLikedListOfConnectedUser(y);
}
/*---------------------------------------------------------------------------------------------- */
const actualiserAvatar = (z) => {
  setAvatartOfTheConnectedUser(z);
}
/*---------------------------------------------------------------------------------------------- */
const actualiserPseudo = (p) => {
  setPseudonymConnectedUser(p);
}
/*---------------------------------------------------------------------------------------------- */

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);    
        setLoading(false);    
      });
        
      // Nettoyer l'effet en désinscrivant l'observateur lorsque le composant est démonté    
      return () => unsubscribe();    
    }, []);
    
/*************************************************************************************************************/
/*            Recherchons les informations concernant tous les utilisateurs                  */
useEffect(() => {
    const requete = async () => {
      const getUserlist = await fetch(
        `https://secours-belivemy-projet-3-default-rtdb.europe-west1.firebasedatabase.app/userList.json`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!getUserlist.ok) {
        toast.error("Une erreur est survenue dans userTweet");
        return;
      }

      const userListData = await getUserlist.json();

      const donneesTransformees = [];
      for (const key in userListData) {
        const dataUserProfile = {
          id: key,
          ...userListData[key],
        };
        donneesTransformees.push(dataUserProfile);
      }

      setUserList(donneesTransformees);
    };

    requete();
  }, []);

  useEffect(() => {
    if (userList && userList.length > 0 && user) {
      /* Dans userConnectedData, on stocke les données de l'utilisateur connecté en ce moment 
      On trouve les données parmi lesquelles le mail inclus est le même que celui de la personne connectée.
      user.mail est celui de l'utilisateur connecté
      On cherche dans userList, le dataUser avec le mail qui sera le même que que user.mail */
      const userConnectedData = userList.find((dataUser) => user.email === dataUser.mailUser);
  
      if (userConnectedData) {
        setIdOfConnectedUser(userConnectedData.id);  
        setPseudonymConnectedUser(userConnectedData.pseudonymUser);  
        setMailOfConnectedUser(userConnectedData.mailUser);
        setFollowListOfConnectedUser(userConnectedData.followList);
        setLikedListOfConnectedUser(userConnectedData.likedList);
        setAvatartOfTheConnectedUser(userConnectedData.avatar);
      } else {  
        console.log(`La variable userConnectedData n'est pas définie. Voici les valeurs de user et userList :`, { user, userList });  
      }  
    }  
  }, [userList, user]
  );


/*************************************************************************************************************/




/*************************************************************************************************************/
    useEffect(() => {
        onAuthStateChanged(auth, (currenUser) => {
            setUser(currenUser);
            setLoading(false);
        })
    }, [])

    // Function
    const logOut = () => {
        setLoading(true);
        setToTheMail("none");
        setMailInterlocutor("none");
        return signOut(auth);
    };

    const loginUser = (email, password) => {
      //console.log(`Appel de la fonction loginUser avec les valeurs suivantes : email = ${email}`);    
        return signInWithEmailAndPassword(auth, email, password);
    };

    const authValue = {
        user,
        loading,
        idOfConnectedUser,
        pseudonymConnectedUser,
        mailOfConnectedUser,
        followListOfConnectedUser,
        likedListOfConnectedUser,
        avatartOfTheConnectedUser,
        toTheMail,
        mailInterlocutor,
        forUpdateMessageReadStatus,
        setMailInterlocutor,
        setToTheMail,
        actualiserListFollow,
        actualiserLikedList,
        actualiserAvatar,
        actualiserPseudo,
        setForUpdateMessageReadStatus,
        logOut,// pour déconnecter notre utilisateur de n'importe où
        loginUser,
    }
    // On retourne authContext. Il faut utiliser une valeur qui pourra être utiliser dans children
    return <AuthContext.Provider value={authValue}>
                {children}
            </AuthContext.Provider>
};

export default AuthProvider;