import { useState, useRef } from "react";
import { toast } from "react-toastify";

export default function ChangeThisTweet(props) {
    const { tweet, IdTweet } = props;
    const [theTweet, setTheTweet] = useState(tweet);
    const saveContent = theTweet;

    const inputNewTweetTitle = useRef();
    const newContentRef = useRef();
    const inputNewImageContent = useRef();

        // Modification du contenu du tweet --------------------------------------------------------------------
        const updateTweet = async () => {
            // Le tweet modifié est dans newTweet
                // Le titre et l'auteur restent les mêmes. Seul le contenu va changer. D'où le useRef utilisé.
            const newTweet = {
                commentaryOf: IdTweet,
                title: inputNewTweetTitle.current.value,
                content : newContentRef.current.value, // Le nouveau contenu sera ce qui est écrit dans le textarea
                author  : theTweet.author,
                datePublication : theTweet.datePublication,
                hourPublication : theTweet.hourPublication,
                image: inputNewImageContent.current.value,
                modified : "  (Modifié)",      
            }
    
            const change = await fetch(
                `https://secours-belivemy-projet-3-default-rtdb.europe-west1.firebasedatabase.app/commentaries/${tweet.id}.json`,
                {
                  method: "PUT", // La méthode PUT pour POSER de nouvelles données
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(newTweet), // stringify pour mettre sous forme de caractère un objet javascript
                }
              );
                // Error
            if (!change.ok) {// En cas d'erreur pendant l'envoi des données sur firebase
            setTheTweet(saveContent);// on rétablit les valeurs d'origine grace à la sauvegarde faite avant les modifications
            toast.error("Erreur !"); // Toast affiche un message d'erreur.
            return;
          }
          props.setChangethisTweetNow(true);
          console.log( "ça devrait mettre à jour la liste des commentaires.");
        };

    return(
        <>
            <input // le inputNewTweetTitle de la const style-component. Ici, ça remplace le mot "input" dans la balise de début
                type="text"
                name="inputNewTweetTitle"
                id="inputNewTweetTitle"
                ref={inputNewTweetTitle}
                size="70"
                defaultValue={tweet.title}
                style={{ margin: "15px auto", display: "block" }}
            />

            <textarea 
                name="contentTweet" 
                id="contentTweet" 
                cols="73" rows="5" 
                ref={newContentRef}
                defaultValue={tweet.content} // Le contenu intial est déjà présent à l'affichage et peut maintenant être modifié
            />
       <div>
            <label htmlFor="inputNewImageContent">Image</label><br></br>
            <input
             type="text"
             name="inputNewImageContent"
             id="inputNewImageContent"
             ref={inputNewImageContent}
             size="50"
             placeholder={theTweet.image}
              />
        </div>

            <button onClick={ updateTweet } >Modifier</button>
        </>
    )
}