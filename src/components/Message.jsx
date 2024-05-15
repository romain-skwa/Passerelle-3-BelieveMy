import { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";
import {GetAuthorTweet} from "../components/InsideTweet/GetAuthorTweet";
import DeleteMessage from "./Message/DeleteMessage";
// Encadré avec dialogue à droite de l'écran qui s'affiche quand l'utilisateur clique sur une notification

// ECRIRE UN MESSAGE A UN AUTRE UTILISATEUR
const MessageBox = () => {
  const [conversationSection, setConversationSection] = useState([]);
  const [inputContentMessage, setInputContentMessage] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const [deleteNow, setDeleteNow] = useState(false); // sera changé quand on clique sur le bouton supprimer (dans le composant DeleteTweet)

  const {
    user,
    idOfConnectedUser,
    pseudonymConnectedUser,
    mailOfConnectedUser,
    toTheMail,
    setToTheMail,
  } = useContext(AuthContext);


  //_________________________________________________________________________________________

  const allTheConversations = useCallback(async () => {
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
      const dataWithId = [];
      // Avec cette boucle for in...
      for (const key in data) {
        const newTweet = {
          id: key, // L'identifiant généré par firebase est maintenant une valeur de l'id que je crée
          ...data[key],
        };
        dataWithId.push(newTweet);// push sert à ajouter dans le tableau de donneesTransformees le contenu de newTweet.
      }
      // On ne garde que les messages qui ont été envoyés ou reçus par l'utilisateur connecté
      const filteredData = Object.entries(dataWithId).filter(([id, message]) => {
        return message.from === mailOfConnectedUser && message.to === toTheMail || message.from === toTheMail && message.to === mailOfConnectedUser;
      });
      
      setConversationSection(filteredData);
    } catch (error) {
      console.error("Erreur dans allTheConversations : ", error);
    }
  }, [mailOfConnectedUser, toTheMail]);

  useEffect(() => {
    allTheConversations();
    setFormattedDate(new Date().toLocaleDateString());
    setFormattedTime(new Date().toLocaleTimeString());
  }, [toTheMail, allTheConversations]);

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
        "https://secours-belivemy-projet-3-default-rtdb.europe-west1.firebasedatabase.app/conversation.json",
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

    // Réinitialiser la valeur de inputContentMessage pour que le textarea se vide juste après l'envoi du message
    setInputContentMessage('');
  };
  
  return (
    <>
    {user && toTheMail !== "none" ?  
    <section className="frameMessage">

      <div style={{display: "flex", justifyContent: "end", cursor:"pointer"}} onClick={() => setToTheMail("none")} >Fermer</div>

      <div style={{ display: "flex", justifyContent: "space-between ", }}>
        <div style={{marginLeft:"1.5rem"}}>{pseudonymConnectedUser}</div>            
        <div style={{marginRight:"1.5rem"}}> <GetAuthorTweet authorTweet={toTheMail} /></div>
      </div>
        
      <div className="conversationContainer" >
        {conversationSection.map(([id, data]) => (
          <div className={data.to !== mailOfConnectedUser ?  null : "lineForAdresse"} key={id}>
            <div className={data.to === mailOfConnectedUser ? "message messageFromAuthor" : "message  messageFromOther"} >
              <div>
                {data.content} <br />
                {/*data.id*/}
                <DeleteMessage
                  data={data}
                  setDeleteNow={setDeleteNow}
                ></DeleteMessage>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>          
        <textarea
          cols="50"
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
        <button onClick={conversation}>Envoyer</button>
      </div>
    </section>
    : null /* Si aucun utilisateur n'est connecté, il n'y a rien*/}
    </>
  );
};

export default MessageBox;