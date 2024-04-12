import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/AuthProvider";

export default function AboutThisUser(){
    // Variable
    const { user } = useContext(AuthContext);
    const [userList, setUserList] = useState();
    const [idOfConnectedUser, setIdOfConnectedUser] = useState(null);
    console.log(` 1 - L'identifiant unique généré (par firebase dans la liste userList) de cet utilisateur connecté : `, idOfConnectedUser);
    //console.log(`userList dans AboutThisUser : `, userList);

    const requete = async () => {
    // Dans la variable const userlist, on va stocker le contenu récupéré sur Firebase
    const getUserlist = await fetch(
        `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/userList.json`,
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
  
      const userListData  = await getUserlist.json();

      console.log(
        " 2 -- Toutes les données recueillies concernant tous les utilisateurs dans la partie userList devraient être affichées ici ",
        userListData 
      );     

      const donneesTransformees = [];
      // Avec cette boucle for in ... aye aye Je n'ai pas encore compris exactement comment ça marche
      for (const key in userListData) {
        const dataUserProfile = {
          id: key, // L'identifiant généré par firebase est maintenant une valeur de l'id que je crée
          ...userListData[key],
        };
        // push sert à ajouter dans le tableau de donneesTransformees le contenu de newTweet.
        donneesTransformees.push(dataUserProfile);
      }
      console.log(" 3 --- La userList ; les données recueillies TRANSFORMÉES dans l'élément AboutThisUser : ", donneesTransformees);
      // donneesTransformees = userListData + id (généré par firebase concernant chaque utilisateur dans RealTime Database)
      setUserList([...donneesTransformees]);
    }

    useEffect(() => {
      requete();
    }, []);

/****************************************************************************************************************************************/

    // Fonction pour mettre à jour l'état idOfConnectedUser
    const updateIdOfConnectedUser = (id) => {
      setIdOfConnectedUser(id);
    };


    // Fonction pour récupérer les données de notre utilisateur connecté.
    const renderUserList = () => {
        if (!userList) {    
            return <div>Chargement...</div>;  
        }

    const userConnectedData = userList.find((dataUser) => user && user.email === dataUser.mailUser);
    // Dans la userList qui contient toutes les informations sur tous les utilisateurs, 
    // nous cherchons la partie concernant l'utilisateur connecté en ce moment.
    // et on stocke les informations de cet utilisateur dans la variable userConnectedData
    console.log(` 4 ---- Le userConnectedData. Les informations stockées dans Realtime Database concernant 
    l'utilisateur connecté en ce moment  : `, userConnectedData);
        return userConnectedData.followList //Cette fonction retourne la liste d'abonnement de notre utilisateur
    };


  // Mettre à jour l'état idOfConnectedUser lorsque userList est mis à jour
  useEffect(() => {
    if (userList && userList.length > 0) {
      const userConnectedData = userList.find((dataUser) => user && user.email === dataUser.mailUser);
      if (userConnectedData) {
        updateIdOfConnectedUser(userConnectedData.id);
      }
    }
  }, [userList]);


/****************************************************************************************************************************************/


return (
    <> 
        {user && renderUserList() /* Si un utilisateur est connecté, alors renderUserList est exécutée. */} 
    </>
)
}