import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";

export default function ChangeMyAvatar() {

    const { user } = useContext(AuthContext);

    const {
    idOfConnectedUser,
    pseudonymConnectedUser,
    mailOfConnectedUser,
    followListOfConnectedUser,
    likedListOfConnectedUser,
    avatartOfTheConnectedUser,
    actualiserAvatar,
    } = useContext(AuthContext);
/************** Pour récupérer et sauvagarder l'adresse de l'image en cas de problème ***********/
    const [preventAvatar, setPreventAvatar] = useState(avatartOfTheConnectedUser || [] );
    
    useEffect(() => {
        setPreventAvatar(avatartOfTheConnectedUser || []);
    return () => setPreventAvatar([]);
    }, [avatartOfTheConnectedUser]);
    
    const saveContent = preventAvatar; // Pour sauvegarder une copie de la liste des tweets aimés par l'utilisateur.
/********************************************************************************** */
    const [newAvatar, setNewAvatar] = useState("");

    const updatePseudo = async () => {
        // Vérifier que le nouveau pseudo a au moins 2 caractères
        if (newAvatar.length < 5) {
          toast.error("Etes-vous sûr que l'adresse fournie est bonne ?.");
          return;
        }
    
        // Ajouter une alerte de confirmation
        const isConfirmed = window.confirm(
          "Voulez-vous vraiment changer de pseudo en " + newAvatar + " ?"
        );
        if (!isConfirmed) {
          return;
        }
    
        // Les données qui seront envoyées afin de modifier le profil de l'utilisateur. En l'occurrence : son pseudonyme
        const newDataAvatar = {
            mailUser: mailOfConnectedUser,
            pseudonymUser: pseudonymConnectedUser,
            followList: followListOfConnectedUser,
            likedList: likedListOfConnectedUser,
            avatar: newAvatar,
        };
    
        const change = await fetch(
          `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/userList/${idOfConnectedUser}.json`,
          {
            method: "PUT", // La méthode PUT pour POSER de nouvelles données
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newDataAvatar), // stringify pour mettre sous forme de caractère un objet javascript
          }
        );
        // Error
        if (!change.ok) {
          // En cas d'erreur pendant l'envoi des données sur firebase
          setPreventAvatar(saveContent); // on rétablit les valeurs d'origine grace à la sauvegarde faite avant les modifications
          toast.error("Erreur !"); // Toast affiche un message d'erreur.
          return;
        }

        actualiserAvatar(newDataAvatar.avatar);
        console.log(
          "Cela devrait mettre à jour l'avatar avec ces données. " + newDataAvatar 
        );
      };

    const handleInputChange = (event) => {
        setNewAvatar(event.target.value);
      };

    return (
        <>
          <p>
            Votre avatar :{" "}
            <img className="largeAvatar" src={avatartOfTheConnectedUser} alt="Votre avatar" />
          </p>
          <input
            type="text"
            placeholder="Entrez l'url de l'image choisie"
            value={newAvatar}
            onChange={handleInputChange}
            style={{ width: "200px" }}
          />
          <button onClick={updatePseudo}>Changer l'avatar</button>
        </>
      );
}