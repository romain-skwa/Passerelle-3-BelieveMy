import { useParams, useNavigate } from "react-router-dom";
import AuthorTweets from "../components/Author/AuthorTweets";
import {useEffect, useState, useContext} from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../store/AuthProvider";

/*
Cette page sert à afficher les tweets d'un utilisateur précis. Pas celui qui est connecté ; un autre.
Pour accéder à cette page, il faut simplement cliquer sur un pseudo.

On utilise useParams pour se servir d'une donnée transmise par l'url de la page 
parce qu'on s'est servi au préalable d'une URL dynamique.
Dans l'url, on récupère authorId pour l'intégrer dans la requête.
authorId est l'identifiant généré aléatoirement par firebase. Il est unique à chaque utilisateur inscrit.
*/

export default function AuthorPage() {
  const { authorId } = useParams();
  const [idTarget, setIdTarget] = useState({ mailUser: "" });
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => { // Sécurité : au cas où un utilisateur cherche à accéder directement à cette page sans être connecté
    if (!user) {
      navigate('/');
    }
  }, [user]);
  
  //console.log("Ce qu'on récupère dans useParams " + authorId)

/***************************************************************************************************** */

const requete = async () => {
  // Dans la variable const userdata, on va stocker le contenu récupéré sur Firebase
  const getUserlist = await fetch(
      `https://secours-belivemy-projet-3-default-rtdb.europe-west1.firebasedatabase.app/userList/${authorId}.json`,
      // Avec cette requête, je récupère les informations stockées dans la partie userList concernant l'auteur que j'ai ciblé.
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!getUserlist.ok) {
      toast.error("Une erreur est survenue pendant la récupération des données");
      return;
    }

    const userData  = await getUserlist.json();
    // convertit la réponse HTTP en un objet JavaScript en analysant le corps de la réponse en JSON
    setIdTarget({ mailUser: userData.mailUser, pseudonymUser: userData.pseudonymUser });
  }

  useEffect(() => {
    requete();
  }, []);

  return (
    <div>
      <h1>Tweets de l'auteur <span style={{textTransform: 'capitalize'}}>{idTarget.pseudonymUser}</span></h1>
      <AuthorTweets authorId={idTarget.mailUser} /> {/*Ce composant va afficher les tweets */}
    </div>
  );
}