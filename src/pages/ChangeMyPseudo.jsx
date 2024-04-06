import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/AuthProvider";

export default function AboutThisUser(){
    // Variable
    const { user } = useContext(AuthContext);
    const { idOfConnectedUser, pseudonymConnectedUser, mailOfConnectedUser } = useContext(AuthContext);

    const [newPseudoUser, setNewPseudoUser ]= useState(pseudonymConnectedUser); // Par défaut le champ contient le nom actuel 
    console.log(`Le nouveau Pseudo qui vient d'être entré `, newPseudoUser); 
    const saveContent = pseudonymConnectedUser; // Pour sauvegarder une copie du pseudo de l'utilisateur.
  

/*******************************************************************************************************************************/

    /* -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --  */

    const updatePseudo = async () => {

      // Vérifier que le nouveau pseudo a au moins 2 caractères
        if (newPseudoUser.length < 2) {
          toast.error("Veuillez entrer au moins deux caractères pour le pseudo.");
          return;
        }
        if (newPseudoUser.length > 25) {
          toast.error("Le pseudo doit contenir au maximum 25 caractères.");
          return;
        }

    // Ajouter une alerte de confirmation
      const isConfirmed = window.confirm("Voulez-vous vraiment changer de pseudo en " + newPseudoUser + " ?");
      if (!isConfirmed) {
        return;
      }
      

    // Les données qui seront envoyées afin de modifier le profil de l'utilisateur. En l'occurrence : son pseudonyme
        const newDataPseudo = {
            mailUser : mailOfConnectedUser,
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
        setNewPseudoUser(saveContent);// on rétablit les valeurs d'origine grace à la sauvegarde faite avant les modifications
      toast.error("Erreur !"); // Toast affiche un message d'erreur.
      return;
    }
    console.log( "ça devrait mettre à jour le pseudo de l'utilisateur connecté en remplaçant " + pseudonymConnectedUser + " par " + newPseudoUser);
  }

    const handleInputChange = (event) => {
        setNewPseudoUser(event.target.value);
      }
    
return (
    <> 
      <p>
        Votre pseudonyme actuel est {" "}{user &&  pseudonymConnectedUser/* Si un utilisateur est connecté, alors le pseudo importé du contexte */}
      </p>
        <input type="text" value={newPseudoUser} onChange={handleInputChange}  style={{ width: "200px" }} />
        <button onClick={updatePseudo}>Mettre à jour le pseudo</button>
      <p>
        Identifiant unique de l'utilisateur dans realtime database : {idOfConnectedUser}
      </p>
    </>
)
}