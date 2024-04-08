import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/AuthProvider";

export default function FollowThisUser(){
    // Variable
    const { user } = useContext(AuthContext);
    const { idOfConnectedUser, pseudonymConnectedUser, mailOfConnectedUser, followListOfConnectedUser } = useContext(AuthContext);
    const [newFollowList, setNewFollowList] = useState([]);

    const saveContent = followListOfConnectedUser; // Pour sauvegarder une copie de la liste d'abonnement de l'utilisateur.

    useEffect(() => {
        setNewFollowList(followListOfConnectedUser || []);/*  Cette ligne met à jour l'état newFollowList avec la 
        valeur de pseudonymConnectedUser ou une chaîne de caractères vide si pseudonymConnectedUser est null ou undefined.
        Cela permet de s'assurer que newFollowList a toujours une valeur définie, même si pseudonymConnectedUser change soudainement.*/
        return () => setNewFollowList([]);/* return () => setNewFollowList(""); : Cette ligne définit une fonction de nettoyage qui 
        sera exécutée avant le prochain rendu du composant AboutThisUser. Cette fonction met à jour l'état newFollowList avec 
        une chaîne de caractères vide, ce qui permet de s'assurer que newFollowList est toujours initialisé à une valeur définie, 
        même si le composant se démonte ou se met à jour pour une raison quelconque.*/
      }, [followListOfConnectedUser]);

    const updateFollowList = async () => {

        // Vérifier que newFollowList a une longueur supérieure à 0
        if (newFollowList.length === 0) {
            toast.error("Veuillez entrer au moins un utilisateur à suivre.");
            return;
          }
                  
        // Les données qui seront envoyées afin de modifier le profil de l'utilisateur. En l'occurrence : son pseudonyme
        const newDataPseudo = {
            mailUser : mailOfConnectedUser,
            pseudonymUser : pseudonymConnectedUser,
            followList : JSON.stringify(newFollowList), // Sérialise newFollowList en JSON avant de l'envoyer à Firebase
        }

        const addToNewFollowList = () => {
            setNewFollowList((prevArray) => [...prevArray, "Charlotte"]);        
          };

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
        setNewFollowList(saveContent);// on rétablit les valeurs d'origine grace à la sauvegarde faite avant les modifications
      toast.error("Erreur !"); // Toast affiche un message d'erreur.
      return(
        <>
        <button onClick={addToNewFollowList}>Suivre cet utilisateur</button>
        </>
      );
    }
  }
}