import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";
import {GetAuthorTweet} from "../../components/InsideTweet/GetAuthorTweet";

const AlertMessage = () => {
  const [conversationSection, setConversationSection] = useState([]);
  const {
    user,
    mailOfConnectedUser,
    setToTheMail,
    setMailInterlocutor,
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

      const dataWithReadNotYet = [];
      // Avec cette boucle for in...
      for (const key in dataAllConversations) {
        const newTweet = {
          id: key, // L'identifiant généré par firebase est maintenant une valeur de l'id que je crée
          ...dataAllConversations[key],
        };
        dataWithReadNotYet.push(newTweet);// push sert à ajouter dans le tableau de donneesTransformees le contenu de newTweet.
      }
      const filteredData = Object.entries(dataWithReadNotYet).filter(([id, message]) => {
        return message.read === "notYet" && message.to === mailOfConnectedUser;  
      });
  
      setConversationSection(filteredData);

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
    try {
      const updatedMessages = conversationSection.filter(([id, message]) => {
        return message.read === "notYet" && message.from === author;
      });
     // console.log(`updatedMessages `, updatedMessages)
  
      const promises = updatedMessages.map(async ([id, conversation ]) => {
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
          throw new Error("Une erreur est survenue lors de la mise à jour de la conversation.");
        }
  
        return response.json(); // convertir la réponse en JSON
      });
  
      await Promise.all(promises);
      allTheConversations(); // Actualiser la liste des conversations après la mise à jour de la lecture
    } catch (error) {
      console.error("Erreur dans updateMessageReadStatus : ", error);
      toast.error("Une erreur est survenue lors de la mise à jour de la conversation.");
    }
  };

  const handleToTheMail = (author) => {
    setMailInterlocutor(author);
    setToTheMail(author);
  };

return (
  <>
  {user && conversationSection.length > 0 ?  // Si l'utilisateur est connecté. La liste de notifications pour les messages s'affiche
    <div className="conversationAlert">
      <p>Nouveaux messages de :</p>
      {authors.map(([author, messages]) => (
        <div key={author}>
          <div>
            <span style={{pointer: "cursor"}} onClick={() => {
              // setToTheMail pour définir dans le contexte l'adresse e-mail de l'auteur dont on veut lire les messages
              // et appeler la fonction updateMessageReadStatus pour marquer les messages comme lus
              handleToTheMail(author);
              updateMessageReadStatus(author);
              }}>{/* Et pour afficher le pseudonyme de l'auteur au lieu de son adresse mail, il faut GetAuthorTweet */}
              <GetAuthorTweet authorTweet={author} cancelLink={true} /> <br /> 
            </span>
          </div>
        </div>
      ))}
      </div> 
      : <p>Vous n'avez pas de nouveaux messages.</p> /* Si aucun utilisateur n'est connecté, il n'y a rien*/}
  </>
);
};

export default AlertMessage;