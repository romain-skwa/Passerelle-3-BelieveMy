import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";
import { GetAuthorTweet } from "../../components/InsideTweet/GetAuthorTweet";

// Dans l'encadré en haut à gauche, on affiche la liste des auteurs qui nous ont écrit de nouveaux messages
const AlertMessage = () => {
  const [conversationSection, setConversationSection] = useState([]);
  const {
    user, // pour savoir si un utilisateur est connecté ou non
    mailOfConnectedUser, // pour obtenir le mail de l'utilisateur connecté, c'est son identifiant
    setMailInterlocutor, // le mail du destinataire, donnée utilisée dans FrameRightMessage, l'encadré de dialogue à DROITE de l'écran
    setMailInterlocutorFrameMiddle, // le mail du destinataire, donnée utilisée dans WriteOneMessage, l'encadré dialogue au MILIEU de l'écran
    forUpdateMessageReadStatus, // pour lancer la fonction qui met à jour le status du message "dejà lu" à partir du composant ListDialogue
    setForUpdateMessageReadStatus,
  } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      allTheConversations();
    }
  }, [user, mailOfConnectedUser]); // Ajout de user comme dépendance pour que l'effet soit réexécuté lorsque l'utilisateur se connecte

  //_________________________________________________________________________________________

  const allTheConversations = async () => {
    try {
      const getAllConversations = await fetch(
        `https://secours-belivemy-projet-3-default-rtdb.europe-west1.firebasedatabase.app/conversation.json`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!getAllConversations.ok) {
        toast.error("Une erreur est survenue dans le composant Alerte Message");
        return;
      }

      const dataAllConversations = await getAllConversations.json();

      const dataWithWithId = [];
      // Avec cette boucle for in...
      for (const key in dataAllConversations) {
        const newTweet = {
          id: key, // L'identifiant généré par firebase est maintenant une valeur de l'id que je crée
          ...dataAllConversations[key],
        };
        dataWithWithId.push(newTweet); // push sert à ajouter dans le tableau de donneesTransformees le contenu de newTweet.
      }
      const dataWithReadNotYet = Object.entries(dataWithWithId).filter(
        ([id, message]) => {
          return (
            message.read === "notYet" && message.to === mailOfConnectedUser
          );
        }
      );

      setConversationSection(dataWithReadNotYet);
    } catch (error) {
      console.error("Erreur dans allTheConversations : ", error);
    }
  };

  //_________________________________________________________________________________________
  const authorsToMessages = conversationSection.reduce((acc, [id, data]) => {
    if (!acc[data.from]) {
      acc[data.from] = [];
    }
    acc[data.from].push({ id, data });
    return acc;
  }, {});

  const authors = Object.entries(authorsToMessages);
  //_________________________________________________________________________________________

  const updateMessageReadStatus = async (author) => {
    //console.log("On lance la fonction updateMessageReadStatus avec pour arguments ", author)
    try {
      const updatedMessages = conversationSection.filter(([id, message]) => {
        return message.read === "notYet" && message.from === author;
      });
      //console.log(`updatedMessages dans le fichier AlertMessage`, updatedMessages)

      const promises = updatedMessages.map(async ([id, conversation]) => {
        const response = await fetch(
          `https://secours-belivemy-projet-3-default-rtdb.europe-west1.firebasedatabase.app/conversation/${conversation.id}.json`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ read: "already" }),
          }
        );

        if (!response.ok) {
          throw new Error(
            "Une erreur est survenue lors de la mise à jour de la conversation."
          );
        }

        setForUpdateMessageReadStatus(null);

        return response.json(); // convertir la réponse en JSON
      });

      await Promise.all(promises);
      allTheConversations(); // Actualiser la liste des conversations après la mise à jour de la lecture
    } catch (error) {
      console.error("Erreur dans updateMessageReadStatus : ", error);
      toast.error("Une erreur est survenue lors de la mise à jour de la conversation.");
    }
  };

  const handlemailInterlocutor = (author) => {
      setMailInterlocutorFrameMiddle(author); // Encadré du milieu
      setMailInterlocutor(author); // Encadré de droite   
    updateMessageReadStatus(author);
    //console.log("On lance via handlemailInterlocutor la fonction updateMessageReadStatus  ");
/* setMailInterlocutor pour définir dans le contexte l'adresse e-mail de l'auteur dont on veut lire les messages
 et appeler la fonction updateMessageReadStatus pour marquer les messages comme lus*/
  };

  useEffect(() => {
    updateMessageReadStatus(forUpdateMessageReadStatus);
    //console.log("On lance via le useEffect la fonction updateMessageReadStatus  ");
  }, [forUpdateMessageReadStatus]);

  return (
    <>
      {
        user && conversationSection.length > 0 ? ( // Si l'utilisateur est connecté. La liste de notifications pour les messages s'affiche
          <div className="conversationAlert apparition">
            <img
              className="mailRed"
              src="../../../icone/envelope_icon_red_white.png"
              alt="Enveloppe Rouge"
            />
            <p>Nouveaux messages de :</p>
            {authors.map(([author, messages]) => (
              <div key={author}>
                <div>
                  <span
                    style={{ pointer: "cursor" }}
                    onClick={() => {
                      handlemailInterlocutor(author);
                    }}
                  >
                    {/* Et pour afficher le pseudonyme de l'auteur au lieu de son adresse mail, il faut GetAuthorTweet */}
                    <GetAuthorTweet authorTweet={author} cancelLink={true} />{" "}
                    <br />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="conversationWith">
            Vous n'avez pas de nouveaux messages.
          </p>
        ) /* Si aucun utilisateur n'est connecté, il n'y a rien*/
      }
    </>
  );
};

export default AlertMessage;
