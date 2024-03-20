import { useRef} from "react";
// import { format } from 'date-fns'; impossible de l'installer pour le moment

// Ce composant est l'enfant du parent Home.
// Il est lié à ListTweet, qui est lui-même aussi un enfant de 

/******************************************************************************************************************* */
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('fr-FR', options).format(date);
}

  const today = new Date();
  const formattedDate = formatDate(today);
  console.log(`La date d'aujourd'hui en français : ${formattedDate}`);

    /*************************************************** */

function formatTime(date) {
  const options = { hour: '2-digit', minute: '2-digit', hour12: false };
  return new Intl.DateTimeFormat('fr-FR', options).format(date);
  }

  const now = new Date();
  const formattedTime = formatTime(now);
  console.log(`L'heure actuelle en français : ${formattedTime}`);

/******************************************************************************************************************* */
export default function FormWriteTweet(props) {

  // Variables
  const inputNewTweetTitle = useRef();
  const inputNewTweetContent = useRef();
  const inputNewAuthorTweet = useRef();
 
  // Création nouveau tweet
  const createNewTweet = async () => {
     
  //  const now = new Date();
  //  const formattedDateTime = format(now, 'dd-MM-yyyy HH:mm:ss');



    const newTweet = {
      title : inputNewTweetTitle.current.value,
      content :inputNewTweetContent.current.value,
      author: inputNewAuthorTweet.current.value,
      datePublication : formattedDate,
      hourPublication : formattedTime,
      //dateTime : formattedDateTime,
    }

  // Ajouter dans firebase
  const response = await fetch(
    "https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/tweetList.json",
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTweet),
            }
        )

   // Error
      if(!response.ok) {
        return  "Une erreur est survenue. Impossible d'afficher la base de données.";        
    }

    const {name: idRandom} = await response.json();
    console.log("Le data.name généré aléatoirement dans Firebase par FormWriteTweet " + idRandom);

    // Appeler la fonction updateListeTweet pour mettre à jour l'état local listeTweet dans le composant parent Home.jsx
      // On exécute, dans l'élément Home, la fonction updateListeTweet avec newTweet en tant que paramètre
      // Cette fonction va ajouter le nouveau tweet (newTweet) à ce qu'il y avait déjà dans listeTweet. Voir le composant Home.
        // Ensuite, la nouvelle liste maintenant composée va remplacer la précédente après l'actualisation du state listeTweet
    props.updateListeTweet(newTweet);
    
  };


  return (
    <div>

        <section className="formulaire">{/* pourquoi ça ne marche pas quand j'écris form ? */}
          <h3 style={{ textAlign: "center" }}>Ecrire un nouveau tweet</h3>

            <label htmlFor="inputNewTweetTitle">Titre<br></br></label>
            <input // le inputNewTweetTitle de la const style-component. Ici, ça remplace le mot "input" dans la balise de début
            type="text" 
            name="inputNewTweetTitle" 
            id="inputNewTweetTitle" 
            ref={inputNewTweetTitle}
            size="50"
            placeholder="Donnez un titre à votre tweet"
            style={{margin: "15px auto", display : "block"}}
            />

          <div>
            <label htmlFor="inputNewTweetContent">Contenu du tweet</label>
            <textarea 
            cols = "50"
            rows="10"
            name="inputNewTweetContent" 
            id="inputNewTweetContent" 
            ref={inputNewTweetContent}
            placeholder="Écrivez votre nouveau tweet ici."
            style={{ margin: "15px auto", padding: "5px", display : "block" }}
            />
          </div>

          <div>
            <input
              type="text"
              name="inputNewAuthorTweet"
              id="inputNewAuthorTweet"
              ref={inputNewAuthorTweet}
              placeholder="Nom de l'auteur"
              />
            </div>

            <div style={{// On ajoute ce bouton pour envoyer les infos seulement quand on clique
              display: "flex",
              justifyContent: "end"
                }}
              onClick={createNewTweet} // La fonction s'exécute quand on clique
            >
            <button>Nouveau tweet</button>
          </div>                
        </section>

    </div>
  )
}