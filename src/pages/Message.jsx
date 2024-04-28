import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";
import { Link } from "react-router-dom";

/**** Obtenir la date actuelle ******************************************************************** */
function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Intl.DateTimeFormat("fr-FR", options).format(date);
}

const today = new Date();
const formattedDate = formatDate(today);
//console.log(`La date d'aujourd'hui en français : ${formattedDate}`);

/***** Obtenir l'heure actuelle *************** */

function formatTime(date) {
  const options = { hour: "2-digit", minute: "2-digit", hour12: false };
  return new Intl.DateTimeFormat("fr-FR", options).format(date);
}

const now = new Date();
const formattedTime = formatTime(now);
//console.log(`L'heure actuelle en français : ${formattedTime}`);

export default function ListTweet(props) {
  // Variable
  const { user } = useContext(AuthContext);
  const { tweet } = props;
  const { tweetId } = useParams();

  const {
    idOfConnectedUser,
    pseudonymConnectedUser,
    mailOfConnectedUser,
  } = useContext(AuthContext);

  const inputContentMessage = useRef();
  const [toTheMail, setToTheMail] = useState(null);
  console.log(`la donnée , l'adresse mail du destinataire : `, toTheMail)

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


  // -----------------------------------------------------------------------------------------------------------------
  // Création nouveau message
  const conversation = async () => {
    
    const newMessage = {
      between: [mailOfConnectedUser, toTheMail],
      from : mailOfConnectedUser,
      to : toTheMail,
      content: inputContentMessage.current.value,
      datePublication: formattedDate,
      hourPublication: formattedTime,
    };

    // Ajouter dans firebase
    const response = await fetch(
      `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/conversation/${formattedDate}${" "}at${" "}${formattedTime}.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      }
    );

    // Error
    if (!response.ok) {
      return "Une erreur est survenue. Impossible d'afficher la base de données.";
    }

    const { name: idRandom } = await response.json();
    console.log(
      "Le data.name généré aléatoirement dans Firebase par FormWriteTweet " +
        idRandom
    );
  };
  /******************************************************************************************************* */
  const [conversationSection, setConversationSection] = useState();

  const allTheConversations = async () => {
    // Dans la variable const adressee, on va stocker le contenu récupéré sur Firebase
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
    setConversationSection(data);
  };
  useEffect(() => {
    allTheConversations();
  }, []);
  console.log(`conversationSection `, conversationSection);

  return (
    <>
      <div>
        <label htmlFor="inputContentMessage">Contenu du message</label>
        <textarea
          cols="50"
          rows="10"
          name="inputContentMessage"
          id="inputContentMessage"
          ref={inputContentMessage}
          placeholder="Écrivez votre nouveau message ici."
          style={{ margin: "15px auto", padding: "5px", display: "block" }}
        />
      </div>

      <div
        style={{
          // On ajoute ce bouton pour envoyer les infos seulement quand on clique
          display: "flex",
          justifyContent: "end",
        }}
        onClick={conversation} // La fonction s'exécute quand on clique
      >
        <button>Nouveau tweet</button>
      </div>
      {toTheMail && (
        <>
        <div>Ici on est censé voir l&apos;adresse mail du destinataire :
          {" " + toTheMail/* Afficher la liste des utilisateurs ici */}
        </div>
        <div>Identifiant de l&apos;utilisateur connecté : {idOfConnectedUser}</div>
        <div>La date actuelle : {formattedDate}</div>
        <section>
          {conversationSection &&
            Object.values(conversationSection).map((conversations, date) => (
              <section key={date}>
                <div>{date}</div>
                {Object.values(conversations).map((conversation, index) => (
                  <section key={index}>
                    <div>{conversation.content}</div>
                    <div>
                      De : {conversation.from} - À : {conversation.to}
                    </div>
                  </section>
                ))}
              </section>
            ))}
          </section>
        </>
      )}
    </>
  )
}