import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";

// ECRIRE UN MESSAGE A UN AUTRE UTILISATEUR
const MessageBox = () => {
  const [conversationSection, setConversationSection] = useState([]);
  const [inputContentMessage, setInputContentMessage] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const {
    idOfConnectedUser,
    mailOfConnectedUser,
    setToTheMail,
  } = useContext(AuthContext);

  useEffect(() => {
    allTheConversations();
    setFormattedDate(new Date().toLocaleDateString());
    setFormattedTime(new Date().toLocaleTimeString());
  }, []);

  //_________________________________________________________________________________________

  const allTheConversations = async () => {
    try {
      const getEverything = await fetch(
        `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/conversation.json`,
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
      // On ne garde que les messages qui ont été envoyés ou reçus par l'utilisateur connecté
      const filteredData = Object.entries(data).filter(([id, message]) => {
        return message.from === mailOfConnectedUser && message.to === toTheMail || message.from === toTheMail && message.to === mailOfConnectedUser;
      });
      setConversationSection(filteredData);
    } catch (error) {
      console.error("Erreur dans allTheConversations : ", error);
    }
  };

  //_________________________________________________________________________________________

  const conversation = async () => {
    if (!toTheMail) {
      toast.error("L'adresse mail du destinataire n'est pas définie.");
      return;
    }

    const newMessage = {
      from: mailOfConnectedUser,
      to: toTheMail,
      content: inputContentMessage,
      datePublication: formattedDate,
      hourPublication: formattedTime,
      read: "notYet",
    };

    try {
      const response = await fetch(
        "https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/conversation.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessage),
        }
      );

      if (!response.ok) {
        toast.error("Une erreur est survenue lors de l'envoi du message.");
        return;
      }

      const { name: idRandom } = await response.json();
      console.log(
        "Le data.name généré aléatoirement dans Firebase par FormWriteTweet " +
          idRandom
      );

      allTheConversations(); // Actualiser la liste des conversations après l'envoi d'un nouveau message
    } catch (error) {
      console.error("Erreur dans conversation : ", error);
    }
  };

  return (
    <section className="frameMessage">
      <ToastContainer />
      <div>
        <label htmlFor="inputContentMessage">Page des messages</label>
        <textarea
          cols="50"
          rows="10"
          name="inputContentMessage"
          id="inputContentMessage"
          value={inputContentMessage}
          onChange={(e) => setInputContentMessage(e.target.value)}
          placeholder="Écrivez votre nouveau message ici."
          style={{ margin: "15px auto", padding: "5px", display: "block" }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "end",
          }}
        >
        <button onClick={conversation}>Envoyer</button>
      </div>

      <div>Ici on est censé voir l&apos;adresse mail du destinataire :
          {" " + toTheMail/* Afficher la liste des utilisateurs ici */}
      </div>
      <div>Identifiant de l&apos;utilisateur connecté : {idOfConnectedUser}</div>
      <div>La date actuelle : {formattedDate}</div>
        
      <div className="conversationContainer">
        {conversationSection.map(([id, data]) => (
          <div className={data.to === mailOfConnectedUser ? "message messageFromOther" : "message  messageFromAuthor"} key={id}>
            <p>
              De : {data.from} <br />
              Pour : {data.to} <br />
              Message : {data.content} <br />
              Date : {data.datePublication} <br />
              Heure : {data.hourPublication} <br />
            </p>
          </div>
        ))}
        </div>
    </section>
  );
};

export default MessageBox;