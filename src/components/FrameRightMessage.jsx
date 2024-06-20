import { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";
import { GetAuthorTweet } from "./InsideTweet/GetAuthorTweet";
import DeleteMessage from "./Message/DeleteMessage";
// Encadré avec dialogue à droite de l'écran qui s'affiche quand l'utilisateur clique sur une notification

// ECRIRE UN MESSAGE A UN AUTRE UTILISATEUR
const FrameRightMessage = () => {
  const [conversationSection, setConversationSection] = useState([]); // Les messages de la conversation ciblée
  const [inputContentMessage, setInputContentMessage] = useState("");
  const [formattedDate, setFormattedDate] = useState(""); // Pour enregistrer la date à laquelle a été écrit le message
  const [formattedTime, setFormattedTime] = useState(""); // Pour enregistrer l'heure à laquelle a été écrit le message
  const [deleteNow, setDeleteNow] = useState(false); // sera changé quand on clique sur le bouton supprimer (dans le composant DeleteTweet)

  const {
    user,
    pseudonymConnectedUser,
    mailOfConnectedUser,
    mailInterlocutor, // Identifiant de l'interlocuteur
    setMailInterlocutor,
    setFrameRightOpen, // Pour changer la donnée indiquant si cet encadré est ouvert ou non
  } = useContext(AuthContext);

  // RÉCUPÉRATION de tous les messages sur la base de données ------ FILTRE ceux qui concerne la conversation visée

  const allTheConversations = useCallback(async () => {
    setFrameRightOpen(true);
    console.log("Les fonctions de l'enadré de droite sont en train de charger");
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
        toast.error("Une erreur est survenue dans userTweet");
        return;
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

      // FILTRE -- On ne garde que les messages qui ont été envoyés ou reçus par l'utilisateur connecté
      const filteredData = Object.entries(dataWithId).filter(
        ([id, message]) => {
          return (
            (message.from === mailOfConnectedUser &&
              message.to === mailInterlocutor) ||
            (message.from === mailInterlocutor &&
              message.to === mailOfConnectedUser)
          );
        }
      );

      setConversationSection(filteredData);
      setDeleteNow(false); // Pour passer deleteNow à sa valeur initiale
    } catch (error) {
      console.error("Erreur dans allTheConversations : ", error);
    }
  }, [mailOfConnectedUser, mailInterlocutor]);

  useEffect(() => {
    // Condition pour appeler les fonctions seulement quand l'utilisateur ouvre l'encadré
    if (user && mailInterlocutor !== "none") {
      allTheConversations();
      setFormattedDate(new Date().toLocaleDateString());
      setFormattedTime(new Date().toLocaleTimeString());
      setDeleteNow(false); // Pour passer deleteNow à sa valeur initiale
    }
  }, [deleteNow, mailInterlocutor, allTheConversations]);
  // deleteNow obtiens la valeur "true" quand un message est supprimé
  // mailInterlocutor a pour valeur l'adresse mail (identifiant) de l'interlocuteur

  //_________________________________________________________________________________________

  const conversation = async () => {
    if (!mailInterlocutor) {
      toast.error("L'adresse mail du destinataire n'est pas définie.");
      return;
    }

    if (inputContentMessage.trim() === "") {
      alert("Votre message doit contenir quelque chose...");
      return;
    }

    const newMessage = {
      from: mailOfConnectedUser,
      to: mailInterlocutor,
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
      //  console.log("Le data.name généré aléatoirement dans Firebase par FormWriteTweet " + idRandom);

      allTheConversations(); // Actualiser automatiquement la conversation après l'envoi d'un nouveau message
    } catch (error) {
      console.error("Erreur dans conversation : ", error);
    }

    // Réinitialiser la valeur de inputContentMessage pour que le textarea se vide juste après l'envoi du message
    setInputContentMessage("");
  };

  /* malgré les useParams, les useLocation, je n'ai pas réussi à faire en sorte que l'encadré de droite se ferme
  si on ouvre l'encadré du milieu de page. Je me retrouvais avec deux fois la même conversation affichée.
  La donnée FrameRightOpen sera true quand cet encaadré de droite sera ouvert
  Et elle sera "false" quand l'encadré sera fermé. */
  useEffect(() => {
    if (mailInterlocutor !== "none") {
      // mailInterlocutor, donnée du contexte. Peut être modifier ici et dans WriteOneMessage
      setFrameRightOpen(true);
    } else {
      setFrameRightOpen(false);
    }
  }, [mailInterlocutor]);

  return (
    <>
      {
        user && mailInterlocutor !== "none" ? (
          <section className="frameRightDialogue">
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                cursor: "pointer",
                padding: "8px",
                margin: "0px 10px 0px",
              }}
              onClick={() => setMailInterlocutor("none")}
            >
              &#10006;
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between ",
                padding: "0 0 5px ",
              }}
            >
              <div style={{ marginLeft: "1.5rem" }}>
                {pseudonymConnectedUser}
              </div>
              <div style={{ marginRight: "1.5rem" }}>
                <GetAuthorTweet authorTweet={mailInterlocutor} />
              </div>
            </div>

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

            <div>
              <textarea
                cols="44"
                rows="4"
                name="inputContentMessage"
                id="inputContentMessage"
                value={inputContentMessage}
                onChange={(e) => setInputContentMessage(e.target.value)}
                placeholder="Écrivez votre nouveau message ici."
                style={{
                  margin: "15px auto",
                  padding: "5px",
                  display: "block",
                  outline: " none",
                  color: "rgb(205, 216, 227)",
                  backgroundColor: "#3c1939",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                className="sendMessageButton" // Bouton d'envoi
                onClick={conversation}
              >
                Envoyer le message à{" "}
                <span style={{ fontWeight: "bold" }}>
                  <GetAuthorTweet
                    theInterlocutorId={mailInterlocutor}
                    cancelLink="true" /* PSEUDONYME */
                  />
                </span>
              </div>
            </div>
          </section>
        ) : null /* Si aucun utilisateur n'est connecté, il n'y a rien*/
      }
    </>
  );
};

export default FrameRightMessage;
