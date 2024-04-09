import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/AuthProvider";

export default function FollowThisUser(){
    // Variable
    const { user } = useContext(AuthContext);
    const { idOfConnectedUser, pseudonymConnectedUser, mailOfConnectedUser, followListOfConnectedUser } = useContext(AuthContext);
    const [newFollowList, setNewFollowList] = useState([]);
    //console.log(`Voici le contenu de newFollowList : `, newFollowList)

    const saveContent = followListOfConnectedUser; // Pour sauvegarder une copie de la liste d'abonnement de l'utilisateur.

    useEffect(() => {
        setNewFollowList(followListOfConnectedUser || []);
        return () => setNewFollowList([]);
      }, [followListOfConnectedUser]);

    // Ajouter "Charlotte" à newFollowList
        const addToNewFollowList = () => {
          setNewFollowList([...newFollowList, "Charlotte"]);
        };
          

        useEffect(() => {

          console.log(`Voici le contenu de newFollowList : `, newFollowList);
        
        }, [newFollowList]);

    const updateFollowList = async () => {

        // Vérifier que newFollowList a une longueur supérieure à 0
        if (newFollowList.length === 0) {
            toast.error("Veuillez entrer au moins un utilisateur à suivre.");
            return;
          }


        // Les données qui seront envoyées afin de modifier le profil de l'utilisateur. En l'occurrence : sa liste d'abonnement
        const newDataFollowList = {
            mailUser : mailOfConnectedUser,
            pseudonymUser : pseudonymConnectedUser,
            followList : newFollowList, // Sérialise newFollowList en JSON avant de l'envoyer à Firebase
        }

        const change = await fetch(
          `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/userList/${idOfConnectedUser}.json`,
          {
            method: "PUT", // La méthode PUT pour POSER de nouvelles données
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newDataFollowList), // stringify pour mettre sous forme de caractère un objet javascript
          }
        );
          // Error
      if (!change.ok) {// En cas d'erreur pendant l'envoi des données sur firebase
        setNewFollowList(saveContent);// on rétablit les valeurs d'origine grace à la sauvegarde faite avant les modifications
      toast.error("Erreur !"); // Toast affiche un message d'erreur.
      return;
    }
  
  }

    return (
      <>
        <button onClick={addToNewFollowList}>Ajouter Charlotte dans la liste</button>
        <button onClick={updateFollowList}>Envoyer la liste dans la base de données</button>
      </>
    );
}