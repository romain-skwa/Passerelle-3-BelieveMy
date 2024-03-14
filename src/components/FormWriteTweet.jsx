import { useRef} from "react";


export default function FormWriteTweet() {

  // Variables
  const inputNewTweetTitle = useRef();
  const inputNewTweetContent = useRef();
  const inputNewAuthorTweet = useRef();
  

    

  // Création nouveau tweet
  const createNewTweet = async () => {
    const newTweet = {
      title : inputNewTweetTitle.current.value,
      content :inputNewTweetContent.current.value,
      author: inputNewAuthorTweet.current.value,
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
}


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