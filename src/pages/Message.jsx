import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";

const MessageBox = () => {
  const [conversationSection, setConversationSection] = useState([]);
  const [inputContentMessage, setInputContentMessage] = useState("");
  const [toTheMail, setToTheMail] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const { tweetId } = useParams();
  const {
    idOfConnectedUser,
    pseudonymConnectedUser,
    mailOfConnectedUser,
  } = useContext(AuthContext);

  useEffect(() => {
    allTheConversations();
    setFormattedDate(new Date().toLocaleDateString());
    setFormattedTime(new Date().toLocaleTimeString());
  }, []);
// On récupère l'adresse mail de l'utilisateur destinataire du message ---------------------------------------------------------

    // Contraint de procéder comme ceci afin d'éviter de montrer l'adresse mail (également identifiant) du destinataire dans l'url
    // A la place le useParams utilisera l'identifiant unique du tweet

  const identification = async () => {
    // Dans la variable const adressee, on va stocker le contenu récupéré sur Firebase
    const getadressee = await fetch(
      `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/tweetList/${tweetId}/author.json`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!getadressee.ok) {
      toast.error("Une erreur est survenue dans userTweet");
      return;
    }

    const data = await getadressee.json();
    setToTheMail(data);
  };
  useEffect(() => {
    identification();
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
      setConversationSection(Object.entries(data));
    } catch (error) {
      console.error("Erreur dans allTheConversations : ", error);
    }
  };

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
    <>
      <ToastContainer />
      <div>
        <label htmlFor="inputContentMessage">Contenu du message</label>
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
        
      <div>
        {conversationSection.map(([id, data]) => (
          <div className="petitMessage" key={id}>
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
    </>
  );
};

export default MessageBox;