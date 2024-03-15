import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"; // On récupère les données grace à l'adresse
import { toast } from "react-toastify";

export default function UnTweet(){
    // Variable
    const {id} = useParams(); // Avec useParams, on va chercher les paramètres dans la barre d'adresse
        console.log(`Paramètres récupérés avec useParams`, id);

    
    const [loading, setLoading] = useState(false); // Pour afficher l'icone de chargement
    
    // Pour travailler sur le tweet choisi, on le stocke dans ce useState.
    // Il est mis à jour avec le setTheTweet dans la requête fetchTheTweet après avoir récupéré le contenu.
    const [theTweet, setTheTweet] = useState({}); // obligé de mettre ces { } en attendant que setTheTweet renvoie des données. Sinon, il y a une erreur.
        console.log(`theTweet `, theTweet);

    
    // Sauvegarde du contenu du tweet pour le réinsérer dans firebase tel qu'il était avant les tentatives de changements en cas d'erreur
    const saveContent = theTweet;
        // Remarque ! Dans la console, quand j'essayais theTweet.content cette const est indéfinie dans un premier temps, puis elle contient bien theTweet.content ensuite.
    console.log(`saveContent`, saveContent);

                /******************************************************** */

    // Ref    qui va servir à modifier le contenu du tweet. L'étiquette est dans le textarea.
    const newContentRef = useRef();// J'avais écrit theTweet.content entre les ( ) mais pas vraiement besoin.

                /******************************************************** */

    // Cycle
    useEffect(() =>{
        fetchTheTweet();
    }, [])// La requête pour chercher les données sur firebase ne s'exécutera qu'une fois au chargemetn de la page.

                /******************************************************** */

    // Fonction
    const fetchTheTweet = async () => {
        if(loading === true) return;// Si cette requête est déjà lancée une première fois, elle ne se lancera pas une deuxième grace au return.
        setLoading(true); // pour voir afficher l'icone de chargement

        try {
    // Ici le paramètre récupéré est l'identifiant affiché après http://localhost:5173/tweetList/ (paramètre récupéré par useParams)
            const response =  await fetch(`https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/tweetList/${id}.json`,
                {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json(); 
            console.log(data);

            setTheTweet(data);
            setLoading(false);
        }
        catch(error){
            setLoading(false);
            toast.error("Une erreur est intervenue.")
        }
    };

    // Modification du contenu du tweet
    const updateTweet = async () => {
        // Le tweet modifié est dans newTweet
            // Le titre et l'auteur restent les mêmes. Seul le contenu va changer. D'où le useRef utilisé.
        const newTweet = {
            title   : theTweet.title,
            content : newContentRef.current.value, // Le nouveau contenu sera ce qui est écrit dans le textarea
            author  : theTweet.author,            
        }

        const change = await fetch(
            `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/tweetList/${id}.json`,
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
    }

    return (
        <>
            <p>{theTweet.author}</p>
            <p>{theTweet.content}</p>
            <textarea 
                name="contentTweet" 
                id="contentTweet" 
                cols="50" rows="5" 
                defaultValue={theTweet.content} // Le contenu intial est déjà présent à l'affichage et peut maintenant être modifié
                ref={newContentRef}
            />
            <button onClick={updateTweet} >
                Modifier
            </button>
        </>
    )
}
// Dans la const newTweet, ne pas se contenter d'insérer seulement le contenu qui va être changer.
// Si on ne place que le contenu changé, l'ensemble sera remplacé par ce contenu et les autres données 
// qui devaient restées identiques seront effacées.
// Donc toujours remettre le contenu qui doit rester le même en plus de celui qui sera changé.