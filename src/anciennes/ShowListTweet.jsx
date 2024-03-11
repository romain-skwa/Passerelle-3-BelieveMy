import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function ListTweet(){
    // State
    const [listeTweet, setListeTweet] = useState();
    const [loading, setLoading] = useState(false);


    // Fonction
    const requete = async () => {
        setLoading(true);
        toast("Chargement...");

        const voyons = await fetch(
            `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/tweetList.json`,
            {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

        if(!voyons.ok) {
            toast.error("Une erreur est survenue");
            }


        const donnéesRecueillies = await voyons.json();
        console.log(donnéesRecueillies);
       // console.log("Essayons de voir l'identifiant qu'on appelle name : " + donnéesRecueillies.name);
        const tmp = Object.values(donnéesRecueillies);
        console.log("tmp = ", tmp);
        setListeTweet(Object.values(donnéesRecueillies));
        // Object.values sert à transformer les objets en tableaux.

        setLoading(false);
    }

    // Le useEffect en utilisé pour que la fonction requete ne soit exécutée qu'une fois. Quand on le décide.
    useEffect(() => {
        requete();
      }, []);// Avec ces crochets vides, la fonction sera exécutée à l'ouverture de la page.

      /********************************************************************************** */

    return( 
        <div className="affichageListeTweet">
            <h3>Liste des tweets</h3>
            {/* 
                la variable listeTweet contient un tableau
                Ce tableau va être lu en boucle par .map
            */}
            <ul>{/* Si listeTweet existe, son contenu est lu par .map*/}
                {listeTweet && listeTweet.map((tweet) => (
                    <li key={tweet.title}>{tweet.title}</li>
                ))}
            </ul>

                {listeTweet && listeTweet.map((tweet) => (
                    <div key={tweet.title} className="cadreTweet">
                        <div>{tweet.author}</div>
                        <div className="cadreTweetContent">{tweet.content}</div>
                        <div>L'id de ce tweet : {tweet.id} </div>
                        <Link to={`/tweetList/${listeTweet.iddutweet}`}>Modifier</Link>
                    </div>
                ))}
    </div>
    )
}
