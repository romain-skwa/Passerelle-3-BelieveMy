import { useRef, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";

// Ce composant est l'enfant du parent Home.
// Il est lié à GetCommentaries, qui est lui-même aussi un enfant de

/**** Obtenir la date actuelle ******************************************************************** */
function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Intl.DateTimeFormat("fr-FR", options).format(date);
}

const today = new Date();
const formattedDate = formatDate(today);
console.log(`La date d'aujourd'hui en français : ${formattedDate}`);

/***** Obtenir l'heure actuelle *************** */

function formatTime(date) {
  const options = { hour: "2-digit", minute: "2-digit", hour12: false };
  return new Intl.DateTimeFormat("fr-FR", options).format(date);
}

const now = new Date();
const formattedTime = formatTime(now);
console.log(`L'heure actuelle en français : ${formattedTime}`);

/****************************** FORMULAIRE ********************************************************** */
export default function FormWriteCommentary(props) {
  const { user } = useContext(AuthContext);
  const { IdTweet, updateListeTweet } = props;

  // Variables
  const inputNewTweetTitle = useRef();
  const inputNewTweetContent = useRef();
  const inputNewImageContent = useRef();

  // Création nouveau tweet
  const createNewCommentary = async () => {
    if (inputNewTweetTitle.current.value.trim() === "") {
      alert("Veuillez entrer un titre pour votre tweet.");
      return;
    }
    if (inputNewTweetContent.current.value.trim() === "") {
      alert("Veuillez entrer un contenu pour votre tweet.");
      return;
    }

    const commentary = {
      commentaryOf: IdTweet,
      title: inputNewTweetTitle.current.value,
      content: inputNewTweetContent.current.value,
      author: user.email,
      datePublication: formattedDate,
      hourPublication: formattedTime,
      image: inputNewImageContent.current.value,
      modified: "",
    };

    // Ajouter dans firebase
    const response = await fetch(
      "https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/commentaries.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentary),
      }
    );

    // Error
    if (!response.ok) {
      return "Une erreur est survenue. Impossible d'afficher la base de données.";
    }
    props.updateListeTweet(commentary);

    // const { name: idRandom } = await response.json();
    // console.log("Le data.name généré aléatoirement dans Firebase par FormWriteTweet " + idRandom);

    // Réinitialiser la valeur de inputContentMessage pour que le textarea se vide juste après l'envoi du message
    inputNewTweetContent.current.value = "";
    inputNewTweetTitle.current.value = "";
    inputNewImageContent.current.value = "";
  };

  return (
    <div>
      {user ? ( // Si un utilisateur est connecté, on affiche la section ci-dessous
        <section className="formulaire">
          {/* pourquoi ça ne marche pas quand j'écris form ? */}
          <h3 style={{ textAlign: "center" }}>Commentez ce tweet</h3>

          <input // le inputNewTweetTitle de la const style-component. Ici, ça remplace le mot "input" dans la balise de début
            type="text"
            name="inputNewTweetTitle"
            id="inputNewTweetTitle"
            ref={inputNewTweetTitle}
            size="72"
            placeholder="Donnez un titre à votre commentaire"
            style={{ margin: "15px auto", padding: "5px", display: "block" }}
          />

          <div>
            <textarea
              cols="54"
              rows="5"
              name="inputNewTweetContent"
              id="inputNewTweetContent"
              ref={inputNewTweetContent}
              placeholder="Écrivez votre nouveau tweet ici."
              style={{ margin: "10px auto", padding: "5px ", display: "block" }}
            />
          </div>

          <div>
            <input
              type="text"
              name="inputNewImageContent"
              id="inputNewImageContent"
              ref={inputNewImageContent}
              size="72"
              placeholder="Coller le lien d'une image."
              style={{ margin: "10px auto", padding: "5px", display: "block" }}
            />
          </div>

          <div
            style={{
              // On ajoute ce bouton pour envoyer les infos seulement quand on clique
              display: "flex",
              justifyContent: "end",
            }}
            onClick={createNewCommentary} // La fonction s'exécute quand on clique
          >
            <button>Commentez</button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
