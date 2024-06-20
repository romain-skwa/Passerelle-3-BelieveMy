import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";
// Composant pour changer ou supprimer l'avatar
// Ce composant est dans la page MyProfile

const API_URL =
  "https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app";
const DEFAULT_AVATAR_URL =
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fst3.depositphotos.com%2F4111759%2F13425%2Fv%2F450%2Fdepositphotos_134255634-stock-illustration-avatar-icon-male-profile-gray.jpg&f=1&nofb=1&ipt=636e3fbcf805042aebb4a071ed67afbf5d79ecb83625d1111894c7832208d33d&ipo=images";

export default function ChangeMyAvatar() {
  const { idOfConnectedUser, avatarOfTheConnectedUser, actualiserAvatar } =
    useContext(AuthContext);

  /* L'utilisation de l'opérateur logique OR (||) permet de définir une valeur par défaut pour preventAvatar lorsque avatarOfTheConnectedUser est "falsy" (undefined, null, 0, false, etc.). Dans ce cas, la valeur par défaut est un tableau vide ([]). */
  const [preventAvatar, setPreventAvatar] = useState(
    avatarOfTheConnectedUser || []
  );
  const [newAvatar, setNewAvatar] = useState("");

  /* La valeur de preventAvatar change à chaque fois que avatarOfTheConnectedUser change dans le contexte */
  useEffect(() => {
    setPreventAvatar(avatarOfTheConnectedUser || []);
    return () =>
      setPreventAvatar(
        []
      ); /*Le return dans le useEffect permet de définir une fonction de nettoyage qui sera exécutée avant que le composant ne soit démonté. */
  }, [avatarOfTheConnectedUser]);

  /* Quand on clique sur le bouton "Changer l'avatar", ça enclenche cette fonction qui donne à newAvatar la valeur écrite dans le champ */
  const handleInputChange = (event) => {
    setNewAvatar(event.target.value);
  };

  const updateAvatar = async (newAvatarUrl) => {
    try {
      const response = await fetch(
        `${API_URL}/userList/${idOfConnectedUser}.json`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ avatar: newAvatarUrl }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'avatar");
      }

      actualiserAvatar(newAvatarUrl);
      setNewAvatar(""); // Vider l'input
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'avatar");
      setPreventAvatar(avatarOfTheConnectedUser || []);
    }
  };

  const deleteAvatar = async () => {
    try {
      await updateAvatar(DEFAULT_AVATAR_URL);
      toast.success("Avatar supprimé avec succès");
      setNewAvatar(""); // Vider l'input
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'avatar");
    }
  };

  return (
    <section className="ChangePseudo">
      <div>
        Votre avatar
        <br></br>
        <img
          className="largeAvatar"
          src={avatarOfTheConnectedUser}
          alt="Votre avatar"
        />
      </div>
      <input
        type="text"
        placeholder="Entrez l'url de l'image choisie"
        value={newAvatar}
        onChange={handleInputChange}
        style={{ width: "300px" }}
      />
      <div className="buttonsAvatar">
        <button onClick={() => updateAvatar(newAvatar)}>
          Changer l'avatar
        </button>
        <button onClick={deleteAvatar}>Supprimer mon avatar</button>
      </div>
    </section>
  );
}
