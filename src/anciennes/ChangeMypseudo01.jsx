import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/AuthProvider";

export default function AboutThisUser(){
    // Variable
    const { user } = useContext(AuthContext);
    const [userList, setUserList] = useState(null);
    const [idOfConnectedUser, setIdOfConnectedUser] = useState(null);
    //console.log(` 1 - L'identifiant unique généré (par firebase dans la liste userList) de cet utilisateur connecté : `, idOfConnectedUser);
    const [pseudonymConnectedUser, setPseudonymConnectedUser] = useState(null);
    console.log(`La donnée pseudonymConnectedUser, le pseudo de l'utilisateur connecté : `, pseudonymConnectedUser);
    
    const [newPseudoUser, setNewPseudoUser ]= useState();
    console.log(`Le nouveau Pseudo qui vient d'être entré `, newPseudoUser);
    const saveContent = idOfConnectedUser; // Pour sauvegarder une copie de l'identifiant de l'utilisateur.

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

    // Fonction pour mettre à jour l'état de followListConnectedUser
    const updatePseudonymConnectedUser = (followList) => {
        setPseudonymConnectedUser(followList)
    };

    /* -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --  */

    // Fonction pour récupérer les données de notre utilisateur connecté.
    const renderUserList = () => {
        if (!userList) {    
            return <div>Chargement...</div>;    
        }

    const userConnectedData = userList.find((dataUser) => user && user.email === dataUser.mailUser);
    // Dans la userList qui contient toutes les informations sur tous les utilisateurs, 
    // nous cherchons la partie concernant l'utilisateur connecté en ce moment.
    // et on stocke les informations de cet utilisateur dans la variable userConnectedData
console.log(
` 4 ---- Le userConnectedData. Les informations stockées dans Realtime Database concernant l'utilisateur connecté en ce moment  : `,
 userConnectedData
 );
        return ( <>
            {" "}
            {userConnectedData.pseudonymUser} {/* Cette fonction retourne le pseudonyme de notre utilisateur */}
            <p> {userConnectedData.id}</p> {/* Cette fonction retourne l'identifiant unique de notre utilisateur */}
         </>
        )
    };

    /* -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --  */

  // Mettre à jour l'état idOfConnectedUser lorsque userList est mis à jour
  // Mettre à jour l'état followListConnectedUser lorsque userList est mis à jour
  useEffect(() => {
    if (userList && userList.length > 0) {
      const userConnectedData = userList.find((dataUser) => user && user.email === dataUser.mailUser);
      if (userConnectedData) {
        updateIdOfConnectedUser(userConnectedData.id);
        updatePseudonymConnectedUser(userConnectedData.pseudonymUser);
      }
    }
  }, [userList]);


/****************************************************************************************************************************************/

    const updatePseudo = async () => {

      // Vérifier que le nouveau pseudo a au moins 2 caractères
        if (newPseudoUser.length < 2) {
          toast.error("Veuillez entrer au moins deux caractères pour le pseudo.");
          return;
        }
        if (newPseudoUser.length > 20) {
          toast.error("Le pseudo doit contenir au maximum 20 caractères.");
          return;
        }

    // Ajouter une alerte de confirmation
      const isConfirmed = window.confirm("Voulez-vous vraiment changer de pseudo en " + newPseudoUser + " ?");
      if (!isConfirmed) {
        return;
      }
      

    // Les données qui seront envoyées afin de modifier le profil de l'utilisateur. En l'occurrence : son pseudonyme
        const userConnectedData = userList.find((dataUser) => user && user.email === dataUser.mailUser);
        const newDataPseudo = {
            followList : userConnectedData.followList,
            mailUser : userConnectedData.mailUser,
            pseudonymUser : newPseudoUser,
        }

        const change = await fetch(
          `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/userList/${idOfConnectedUser}.json`,
          {
            method: "PUT", // La méthode PUT pour POSER de nouvelles données
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newDataPseudo), // stringify pour mettre sous forme de caractère un objet javascript
          }
        );
          // Error
      if (!change.ok) {// En cas d'erreur pendant l'envoi des données sur firebase
      setPseudonymConnectedUser(saveContent);// on rétablit les valeurs d'origine grace à la sauvegarde faite avant les modifications
      toast.error("Erreur !"); // Toast affiche un message d'erreur.
      return;
    }
    console.log( "ça devrait mettre à jour le pseudo de l'utilisateur connecté en remplaçant " + pseudonymConnectedUser + " par " + newPseudoUser);
  }

    const handleInputChange = (event) => {
        setNewPseudoUser(event.target.value);
      }
    
return (
    <> Votre pseudonyme actuel est 
        {user && renderUserList() /* Si un utilisateur est connecté, alors renderUserList est exécutée. */} 
        <input type="text" value={newPseudoUser} onChange={handleInputChange}  placeholder={pseudonymConnectedUser}/>
        <button onClick={updatePseudo}>Mettre à jour le pseudo</button>
        <div>{pseudonymConnectedUser}</div>
    </>
)
}