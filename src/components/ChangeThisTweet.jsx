import { useState, useRef } from "react";

export default function ChangeThisTweet(props) {
    const { tweet } = props;
    const [theTweet, setTheTweet] = useState(tweet);
    const saveContent = theTweet;

    const newContentRef = useRef();

        // Modification du contenu du tweet --------------------------------------------------------------------
        const updateTweet = async () => {
            // Le tweet modifié est dans newTweet
                // Le titre et l'auteur restent les mêmes. Seul le contenu va changer. D'où le useRef utilisé.
            const newTweet = {
                title   : theTweet.title,
                content : newContentRef.current.value, // Le nouveau contenu sera ce qui est écrit dans le textarea
                author  : theTweet.author,
                datePublication : theTweet.datePublication,
                hourPublication : theTweet.hourPublication,          
            }
    
            const change = await fetch(
                `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/tweetList/${tweet.id}.json`,
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
          console.log( "ça devrait mettre à jour la liste des tweets");
        };

    return(
        <>
            <textarea 
                name="contentTweet" 
                id="contentTweet" 
                cols="73" rows="5" 
                ref={newContentRef}
                defaultValue={tweet.content} // Le contenu intial est déjà présent à l'affichage et peut maintenant être modifié
            />
            <button onClick={ updateTweet } >Modifier</button>
        </>
    )
}