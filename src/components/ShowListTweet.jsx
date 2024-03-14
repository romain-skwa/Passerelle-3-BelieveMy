import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function ListTweet(){
    // State
    const [listeTweet, setListeTweet] = useState([]);
    const [loading, setLoading] = useState(false);


    // Fonction
    const requete = async () => {
        setLoading(true);
        toast("Chargement...");

        const donneesRecueillies = await fetch(
            `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/tweetList.json`,
            {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

        if(!donneesRecueillies.ok) {
            toast.error("Une erreur est survenue");
            return
            }


        const donnees = await donneesRecueillies.json();
        console.log("Les données recueillies devraient être affichées ici ", donnees);
        //const donneesTransformees = Object.values(donnees);
        const donneesTransformees = [];
        for (const key in donnees ) {
          const newTweet = {
            id: key,
            ...donnees[key], 
          }
          donneesTransformees.push(newTweet);
        }
        console.log( "donnees transformees : ",  donneesTransformees);
        
       // const tmp = Object.values(donnéesRecueillies);
       // console.log("tmp = ", tmp);
       // setListeTweet(Object.values(donnéesRecueillies));
        // Object.values sert à transformer les objets en tableaux.

      
      setListeTweet([...donneesTransformees]);
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
                      <div>
                        <div>{tweet.author}</div>
                        <div className="cadreTweetContent">{tweet.content}</div>
                        <div>L'id de ce tweet : {tweet.id} </div>
                        <Link to={`tweetList/${tweet.id}`}>Modifier</Link> 
                       </div>
                  </div>
                ))}
    </div>
    )
}
