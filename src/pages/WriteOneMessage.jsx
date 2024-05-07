import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";
import  ListDialogue  from "../components/ListDialogue";
import { GetAuthorTweet } from "../components/InsideTweet/GetAuthorTweet";

// ECRIRE UN MESSAGE A UN AUTRE UTILISATEUR
const MessageBox = () => {
  const [conversationSection, setConversationSection] = useState([]);
  const [inputContentMessage, setInputContentMessage] = useState("");
  const [toTheMail, setToTheMail] = useState("");// Destinataire
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const { tweetId } = useParams(); // Identifiant du tweet récupéré pour retrouver l'adresse mail (identifiant) du destinataire.
  const {
    idOfConnectedUser,
    mailOfConnectedUser,
    pseudonymConnectedUser,
  } = useContext(AuthContext);

  useEffect(() => {
    allTheConversations();
    setFormattedDate(new Date().toLocaleDateString());
    setFormattedTime(new Date().toLocaleTimeString());
  }, [toTheMail]);

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
    
    // Réinitialiser la valeur de inputContentMessage pour que le textarea se vide juste après l'envoi du message
    setInputContentMessage('');

    } catch (error) {
      console.error("Erreur dans conversation : ", error);
    }
  };

  return (
    <section className="WriteOneMessage">
      <ToastContainer />
 
      <div>La date actuelle : {formattedDate}</div>

      <ListDialogue setToTheMail={setToTheMail} />

      <div style={{ display: "flex", justifyContent: "space-between ", border:"solid pink 1px"}}>
        <div style={{marginLeft:"1.5rem"}}>{pseudonymConnectedUser}</div>            
        <div style={{marginRight:"1.5rem"}}> <GetAuthorTweet theInterlocutorId={toTheMail} /></div>
      </div>
      
      <div className="conversationContainer">
        {conversationSection.map(([id, data]) => (
          <div className={data.to !== mailOfConnectedUser ?  null : "lineForAdresse"} key={id}>
            <div className={data.to === mailOfConnectedUser ? "message  messageFromAuthor" : "message messageFromOther"} key={id}>
              <p> 
                {data.content} <br />
                Le {data.datePublication} à {data.hourPublication} <br />
              </p>
            </div>
          </div>
        ))}
      </div>

      <section className="writeTheMessage">
        <div>
          <textarea
            cols="60"
            rows="4"
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
          <div className="sendMessageButton" onClick={conversation}>Envoyer le message à <span style={{fontWeight:"bold"}}> <GetAuthorTweet theInterlocutorId={toTheMail} cancelLink="true" /* PSEUDONYME */ /></span></div>
        </div>
      </section>
    </section>
  );
};

export default MessageBox;