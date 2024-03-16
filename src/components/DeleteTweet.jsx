import { toast } from "react-toastify";
import {  useNavigate } from "react-router-dom"; 
import { useState } from "react";

// DeleteTweet est le composant bouton qui se trouve dans le composant ListTweet

 // Props { tweet } pour transmettre aux lignes ci-dessous les données venant du composant parent DeleteTweet
export default function DeleteTweet({ tweet }) {
    const navigate = useNavigate(); // Pour rediriger automatiquement une fois que le tweet est modifié
    const [loading, setLoading] = useState(false); // Pour afficher l'icone de chargement

    const onDeleteThisTweet = async () => {
        // Delete
        if (window.confirm("Voulez-vous vraiment supprimer ce tweet ?")) {
            setLoading(true);

            // Supprimer cette donnée de la base de données Firebase
            const response = await fetch (`https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/tweetList/${tweet.id}.json`,
            {
                method: "DELETE", // Méthode pour supprimer le tweet sélectionné juste au dessus
                headers: {
                    "Content-type": "application/json"
                }
            })

            // Erreur
            if (!response.ok) {
                toast.error("Une erreur est intervenue.");
                setLoading(false);
                return;
            }
            setLoading(false);
            navigate(`/`);
            window.location.reload();
        }
    }
    return(
        <button onClick={onDeleteThisTweet}>Supprimer {tweet.id}</button>
    )
}