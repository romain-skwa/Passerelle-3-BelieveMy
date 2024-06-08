import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../store/AuthProvider";
import { toast } from "react-toastify";

export default function CommentariesCounter(props) {
  const { tweet,   } = props;
  const [loading, setLoading] = useState(false);
  const [countCommentaries, setCountCommentaries] = useState(0);

   //----------- Fonction -----------------------------------------------------------------------------------
  const getCommentariesOfThisTweet = async () => {
    // REQUETE pour obtenir les commentaires (Les titres, les contenus, nom de l'auteur)
    setLoading(true);
    toast("Chargement...");

    // Dans la variable const donneesRecueillies, on va stocker le contenu récupéré sur Firebase
    const donneesRecueillies = await fetch(
        `https://secours-belivemy-projet-3-default-rtdb.europe-west1.firebasedatabase.app/commentaries.json`,      
        {      
          method: "GET",      
          headers: {      
            "Content-Type": "application/json",      
          },      
        }      
      ).catch(error => {      
        console.error('Une erreur s\'est produite lors de la récupération des données : ', error);      
        toast.error('Une erreur s\'est produite lors de la récupération des données');      
      });

    if (!donneesRecueillies.ok) {
      toast.error("Une erreur est survenue dans getCommentariesOfThisTweet");
      return;
    }

    const dataCommentaries = await donneesRecueillies.json();

    setCountCommentaries(Object.values(dataCommentaries).filter(commentary => commentary.commentaryOf === tweet.id).length);
    //console.log("La requête getCommentariesOfThisTweet est bien lancée.");
  };

  useEffect(() => {
    getCommentariesOfThisTweet();
  }, []); 

  //console.log('getCommentariesOfThisTweet ', countCommentaries);      

  return (
    <>
        <div className="numberCommentaries">{countCommentaries} </div>
    </>
  );
}