import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";

const AlertMessage = () => {
  const [conversationSection, setConversationSection] = useState([]);
  const [inputContentMessage, setInputContentMessage] = useState("");
  const [toTheMail, setToTheMail] = useState("");// Destinataire
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const { tweetId } = useParams();// Identifiant du tweet récupéré pour retrouver l'adresse mail (identifiant) du destinataire.
  const {
    user,
    mailOfConnectedUser,
  } = useContext(AuthContext);

  useEffect(() => {
    allTheConversations();
    setFormattedDate(new Date().toLocaleDateString());
    setFormattedTime(new Date().toLocaleTimeString());
  }, [toTheMail]);// je me demande si ce useEffect est vraiment utile

  useEffect(() => {
    if (user) {
      allTheConversations();
      setFormattedDate(new Date().toLocaleDateString());
      setFormattedTime(new Date().toLocaleTimeString());
    }
  }, [user]); // user est une dépendance pour que l'effet soit réexécuté lorsque l'utilisateur se connecte
  

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
  
      const dataWithReadNotYet = await getEverything.json();
      const filteredData = Object.entries(dataWithReadNotYet).filter(([id, message]) => {
        return message.read === "notYet" && message.to === mailOfConnectedUser;  
      });
  
      setConversationSection(filteredData);

        } catch (error) {
      console.error("Erreur dans allTheConversations : ", error);
    }
  };
  
  //_________________________________________________________________________________________

  return (
    <>
    {user ?  // Si l'utilisateur est connecté. La lsite de notifications pour les messages s'affiche
      <div className="conversationContainer">
        {conversationSection.map(([id, data]) => (
          <div key={id}>
            <p>
              Vous avez un messages de : {data.from} <br /> 
            </p>
          </div>
        ))}
        </div> 
        : null /* Si aucun utilisateur n'est connecté, il n'y a rien*/}
    </>
  );
};

export default AlertMessage;