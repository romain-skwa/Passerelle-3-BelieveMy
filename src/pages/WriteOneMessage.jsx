import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";
import { GetAuthorTweet } from "../components/InsideTweet/GetAuthorTweet";
import DeleteMessage from "../components/Message/DeleteMessage";
import { useNavigate } from "react-router-dom";

// ECRIRE UN MESSAGE A UN AUTRE UTILISATEUR
const MessageBox = () => {
  const [conversationSection, setConversationSection] = useState([]);
  const [inputContentMessage, setInputContentMessage] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const [deleteNow, setDeleteNow] = useState(false); // sera changé quand on clique sur le bouton supprimer (dans le composant DeleteTweet)
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    // Sécurité : au cas où un utilisateur cherche à accéder directement à cette page sans être connecté
    if (!user) {
      navigate("/");
    }
  }, [user]);

  const {
    mailOfConnectedUser,
    pseudonymConnectedUser,
    mailInterlocutorFrameMiddle,
    setMailInterlocutor,
  } = useContext(AuthContext);

  useEffect(() => {
    setMailInterlocutor("none");
    allTheConversations();
    setFormattedDate(new Date().toLocaleDateString());
    setFormattedTime(new Date().toLocaleTimeString());
    setDeleteNow(false);
  }, [deleteNow, mailInterlocutorFrameMiddle]);

  //_________________________________________________________________________________________

  useEffect(() => {
    return () => {
      setMailInterlocutor("none");
    };
  }, []);

  const allTheConversations = async () => {
    try {
      const getAllConversations = await fetch(
        `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/conversation.json`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!getAllConversations.ok) {
        throw new Error(
          "Une erreur est survenue dans la page Écrire un meesage"
        );
      }

      const dataAllConversations = await getAllConversations.json();

      const dataWithId = [];
      // Avec cette boucle for in...
      for (const key in dataAllConversations) {
        const newTweet = {
          id: key, // L'identifiant généré par firebase est maintenant une valeur de l'id que je crée
          ...dataAllConversations[key],
        };
        dataWithId.push(newTweet); // push sert à ajouter dans le tableau de donneesTransformees le contenu de newTweet.
      }

      // On ne garde que les messages qui ont été envoyés ou reçus par l'utilisateur connecté Et par l'interlocuteur ciblé
      const filteredData = Object.entries(dataWithId).filter(
        ([id, message]) => {
          return (
            (message.from === mailOfConnectedUser &&
              message.to === mailInterlocutorFrameMiddle) ||
            (message.from === mailInterlocutorFrameMiddle &&
              message.to === mailOfConnectedUser)
          );
        }
      );
      setConversationSection(filteredData);
    } catch (error) {
      console.error("Erreur dans allTheConversations : ", error);
      toast.error(error.message);
    }
  };

  // On écrit un nouveau message_________________________________________________________________________________________

  const conversation = async () => {
    if (!mailInterlocutorFrameMiddle) {
      toast.error("L'adresse mail du destinataire n'est pas définie.");
      return;
    }

    if (inputContentMessage.trim() === "") {
      alert("Votre message doit contenir quelque chose...");
      return;
    }

    const newMessage = {
      from: mailOfConnectedUser,
      to: mailInterlocutorFrameMiddle,
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
      //console.log("Le data.name généré aléatoirement dans Firebase par FormWriteTweet " + idRandom);

      allTheConversations(); // Actualiser la liste des conversations après l'envoi d'un nouveau message

      // Réinitialiser la valeur de inputContentMessage pour que le textarea se vide juste après l'envoi du message
      setInputContentMessage("");
    } catch (error) {
      console.error("Erreur dans conversation : ", error);
    }
  };

  return (
    <section className="WriteOneMessage">
      <ToastContainer />

      <div className="twoNames">
        <div style={{ marginLeft: "1.5rem" }}>{pseudonymConnectedUser}</div>{" "}
        {/* Nom de l'utilisateur connecté */}
        <div style={{ marginRight: "1.5rem" }}>
          {" "}
          <GetAuthorTweet theInterlocutorId={mailInterlocutorFrameMiddle} />
        </div>{" "}
        {/* Nom de son interlocuteur */}
      </div>

      {mailOfConnectedUser && (
        <div className="conversationContainer">
          {conversationSection.map(([id, data]) => (
            <div
              className={
                data.from === mailOfConnectedUser ? null : "lineForAdresse"
              }
              key={id}
            >
              <div
                className={
                  data.from === mailOfConnectedUser
                    ? "message messageFromAuthor"
                    : "message messageFromOther"
                }
                key={id}
              >
                <div>
                  {data.content} <br />
                  <span style={{ fontSize: "0.7rem" }}>
                    Le {data.datePublication} à {data.hourPublication}
                  </span>
                  <DeleteMessage
                    data={data}
                    setDeleteNow={setDeleteNow}
                  ></DeleteMessage>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <section className="writeTheMessage">
        <div>
          <textarea
            cols="55"
            rows="4"
            name="inputContentMessage"
            id="inputContentMessage"
            value={inputContentMessage}
            onChange={(e) => setInputContentMessage(e.target.value)}
            placeholder="Écrivez votre nouveau message ici."
            className="textareawriteTheMessage"
            style={{ margin: "15px auto", padding: "5px", display: "block" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "end" }}>
          <div
            className="sendMessageButton" // Bouton d'envoi
            onClick={conversation}
          >
            Envoyer le message à{" "}
            <span style={{ fontWeight: "bold" }}>
              <GetAuthorTweet
                theInterlocutorId={mailInterlocutorFrameMiddle}
                cancelLink="true" /* PSEUDONYME */
              />
            </span>
          </div>
        </div>
      </section>
    </section>
  );
};

export default MessageBox;
