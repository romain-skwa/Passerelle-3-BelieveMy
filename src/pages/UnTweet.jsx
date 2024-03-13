import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // On récupère les données grace à l'adresse
import { toast } from "react-toastify";

export default function UnTweet(){
    // Variable
    const {id} = useParams();
        console.log(`Paramètres récupérés avec useParams`, id);
    
    const [loading, setLoading] = useState(false);
    const [theTweet, setTheTweet] = useState();
    console.log(`theTweet `, theTweet);
    useEffect(() =>{
        fetchTheTweet();
    }, [])

    // Fonction
    const fetchTheTweet = async () => {
        if(loading === true) return;
        setLoading(true);

        try {
            const response =  await fetch(`https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/tweetList/${id}.json`,
                {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json(); console.log(data);
            setTheTweet(data);
            setLoading(false);
        }
        catch(error){
            setLoading(false);
            toast.error("Une erreur est intervenue.")
        }
    };

    // Ici le paramètre récupéré est l'identifiant affiché après http://localhost:5173/tweetList/ (paramètre récupéré)
    return (
        <>
        {theTweet.author}
        {theTweet.content}
        </>
    )
}