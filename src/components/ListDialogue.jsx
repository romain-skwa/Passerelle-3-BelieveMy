import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";
import { GetAuthorTweet } from "../components/InsideTweet/GetAuthorTweet";
import AlertMessage from "../components/Message/AlertMessage";
import { Link } from "react-router-dom";

// Encadré affichant les noms des interlocuteurs de l'utilisateur connecté

export default function ListDialogue({ showOnlyUnread = false }) {
  const [conversationSection, setConversationSection] = useState([]);
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const [uniqueNames, setUniqueNames] = useState(new Set());
  const { user, mailOfConnectedUser, setMailInterlocutor } = useContext(AuthContext);
  const [unreadInterlocutors, setUnreadInterlocutors] = useState([]);

  useEffect(() => {
    allTheConversations();
    setFormattedDate(new Date().toLocaleDateString());
    setFormattedTime(new Date().toLocaleTimeString());
  }, [mailOfConnectedUser]);

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
        toast.error("Une erreur est survenue dans le composant ListDialogue");
        return;
      }

      const dataAllConversations = await getAllConversations.json();

      // Filtre pour ne garder que les messages qui ont été écrits ou reçus par mailOfConnectedUser
      const filteredConversations = Object.values(dataAllConversations).filter((message) => {
        return message.from === mailOfConnectedUser || message.to === mailOfConnectedUser;
      });

      setConversationSection(filteredConversations);

      // Mettre à jour le set des noms uniques
      const names = new Set();
      filteredConversations.forEach((message) => {
        names.add(message.from);
        names.add(message.to);
      });
      setUniqueNames(names);

      // Extraction des interlocuteurs avec des messages non lus
      const unreadInterlocutors = filteredConversations.filter((message) => message.read === "notYet").map((message) => message.from === mailOfConnectedUser ? message.to : message.from);
      setUnreadInterlocutors(Array.from(new Set(unreadInterlocutors)));
      
    } catch (error) {
      console.error("Erreur dans allTheConversations : ", error);
    }
  };

  const handleToTheMail = (theInterlocutorId) => {
    setMailInterlocutor(theInterlocutorId);
  };

  // Filtrer les interlocuteurs affichés en fonction de la valeur de showOnlyUnread
  const displayedInterlocutors = showOnlyUnread
    ? unreadInterlocutors
    : Array.from(uniqueNames);

  return (
    <>
      {user ? // Cette section n'apparaitra que si l'utilisateur est bien connecté
        <section className="listDialogue">
          <AlertMessage />
          Vos conversations :
          {displayedInterlocutors.map((theInterlocutorId) => (
            <Link to={`/WriteOneMessage`} className="nameInterlocutor" key={theInterlocutorId} onClick={() => handleToTheMail(theInterlocutorId)} style={{ cursor: "pointer" }}>
              <GetAuthorTweet theInterlocutorId={theInterlocutorId} cancelLink="true" /* PSEUDONYME */ />
            </Link>
          ))}
        </section>
        : null}
    </>
  );
}