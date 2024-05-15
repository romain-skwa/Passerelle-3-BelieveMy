import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";
import { GetAuthorTweet } from "../components/InsideTweet/GetAuthorTweet";
// finalement, ce composant n'est pas utilisé (pour l'instant)
const ConversationList = () => {
  const [conversationSection, setConversationSection] = useState([]);
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const [uniqueNames, setUniqueNames] = useState(new Set());
  const [unreadMessages, setUnreadMessages] = useState([]);
  const { user, mailOfConnectedUser, setMailInterlocutor } = useContext(AuthContext);

  useEffect(() => {
    allTheConversations();
    setFormattedDate(new Date().toLocaleDateString());
    setFormattedTime(new Date().toLocaleTimeString());
  }, [mailOfConnectedUser]);

  const allTheConversations = async () => {
    try {
      const getEverything = await fetch(
        `https://secours-belivemy-projet-3-default-rtdb.europe-west1.firebasedatabase.app/conversation.json`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!getEverything.ok) {
        toast.error("Une erreur est survenue dans userTweet");
        return;
      }

      const data = await getEverything.json();

      // Filtre pour ne garder que les messages qui ont été écrits ou reçus par mailOfConnectedUser
      const filteredConversations = Object.values(data).filter((message) => {
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

      // Mettre à jour la liste des messages non lus
      const unreadMessages = filteredConversations.filter((message) => message.read === "notYet" && message.to === mailOfConnectedUser);
      setUnreadMessages(unreadMessages);
    } catch (error) {
      console.error("Erreur dans allTheConversations : ", error);
    }
  };

  const interlocutorIds = Array.from(uniqueNames).map((name) =>
    name === mailOfConnectedUser
      ? conversationSection.find((message) => message.to === name)?.to
      : conversationSection.find((message) => message.from === name)?.from
  );

  const handleToTheMail = (theInterlocutorId) => {
    setMailInterlocutor(theInterlocutorId);
  };

  return (
    <>
      {user ? (
        <section className="conversationList">
          Vos conversations :
          {interlocutorIds.map((theInterlocutorId) => (
            <div
              key={theInterlocutorId}
              onClick={() => handleToTheMail(theInterlocutorId)}
              style={{ cursor: "pointer" }}
            >
              <GetAuthorTweet theInterlocutorId={theInterlocutorId} cancelLink="true" />
              {unreadMessages.some((message) => message.from === theInterlocutorId) && (
                <span className="unread-message-indicator">Nouveau message</span>
              )}
            </div>
          ))}
        </section>
      ) : null}
    </>
  );
};

export default ConversationList;