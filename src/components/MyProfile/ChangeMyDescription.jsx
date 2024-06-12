import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";
// Composant pour changer ou supprimer la description
// Ce composant est dans la page MyProfile

const API_URL = "https://secours-belivemy-projet-3-default-rtdb.europe-west1.firebasedatabase.app";
const DEFAULT_DESCRIPTION_URL = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fst3.depositphotos.com%2F4111759%2F13425%2Fv%2F450%2Fdepositphotos_134255634-stock-illustration-description-icon-male-profile-gray.jpg&f=1&nofb=1&ipt=636e3fbcf805042aebb4a071ed67afbf5d79ecb83625d1111894c7832208d33d&ipo=images";

export default function ChangeMyDescription() {
  const {user, idOfConnectedUser, descriptiontOfTheConnectedUser, actualiserDescription } = useContext(AuthContext);

/* L'utilisation de l'opérateur logique OR (||) permet de définir une valeur par défaut pour preventDescription lorsque descriptiontOfTheConnectedUser est "falsy" (undefined, null, 0, false, etc.). Dans ce cas, la valeur par défaut est un tableau vide ([]). */
  const [preventDescription, setPreventDescription] = useState(descriptiontOfTheConnectedUser || []);
  const [newDescription, setNewDescription] = useState("");

/* La valeur de preventDescription change à chaque fois que descriptiontOfTheConnectedUser change dans le contexte */
  useEffect(() => {
    setPreventDescription(descriptiontOfTheConnectedUser || []);
    return () => setPreventDescription([]);/*Le return dans le useEffect permet de définir une fonction de nettoyage qui sera exécutée avant que le composant ne soit démonté. */
  }, [descriptiontOfTheConnectedUser]);
  
  useEffect(() => {
    setNewDescription(descriptiontOfTheConnectedUser || "");
    return () =>
        setNewDescription(""); 
  }, [descriptiontOfTheConnectedUser]);

/* Quand on clique sur le bouton "Changer description", ça enclenche cette fonction qui donne à newDescription la valeur écrite dans le champ */
const handleInputChange = (event) => {
  const maxLength = 350;
  const newDescription = event.target.value;
  if (newDescription.length > maxLength) {
    event.target.value = newDescription.substring(0, maxLength);
  } else {
    setNewDescription(newDescription);
  }
};

  const updateDescription = async (newDescription) => {
    try {
      const response = await fetch(`${API_URL}/userList/${idOfConnectedUser}.json`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: newDescription }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de description");
      }

      actualiserDescription(newDescription);
      setNewDescription(""); // Vider l'input
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de description");
      setPreventDescription(descriptiontOfTheConnectedUser || []);
    }
  };

  const deleteDescription = async () => {
    try {
      await updateDescription(DEFAULT_DESCRIPTION_URL);
      toast.success("Description supprimé avec succès");
      setNewDescription(""); // Vider l'input
    } catch (error) {
      toast.error("Erreur lors de la suppression de description");
    }
  };

  return (
    <section className="ChangePseudo">
      <div>
        Votre description actuelle :
        <br></br>
        { user && descriptiontOfTheConnectedUser }
      </div>
      <textarea
        type="text"
        cols="36"
        rows="5"
        placeholder="Ecrivez ici votre nouvelle description"
        value={newDescription}
        onChange={handleInputChange}
        maxLength={150}
      />
      <p style={{ color: "red", fontSize: "12px", margin: "5px 0" }}>
        {newDescription.length > 150 ? "La description est limitée à 150 caractères." : ""}
      </p>
      <div className="buttonsAvatar">
        <button onClick={() => updateDescription(newDescription)}>Changer la description</button>
        <button onClick={deleteDescription}>Supprimer mon description</button>
      </div>
    </section>
  );
}
