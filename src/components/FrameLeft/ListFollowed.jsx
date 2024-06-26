import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../store/AuthProvider";
import { Link } from "react-router-dom";
// Page où l'utilisateur peut voir tous les auteurs qu'il suit et les tweets de ces auteurs
export default function ListFollowed() {
  // Variable
  const { followListOfConnectedUser, changeAuthorPage } =
    useContext(AuthContext);
  //console.log(`Contenu de followListOfConnectedUser `,followListOfConnectedUser);
  const [loading, setLoading] = useState(false);
  const [listeFollow, setListeFollow] = useState([]);
  //console.log(`Contenu de listeFollow `, listeFolldow);

  //----------- Fonction -----------------------------------------------------------------------------------
  useEffect(() => {
    const requete = async () => {
      // REQUETE pour obtenir les tweets (Les titres, les contenus, nom de l'auteur)
      setLoading(true);
      toast("Chargement...");

      // Dans la variable const donneesRecueillies, on va stocker le contenu récupéré sur Firebase
      const donneesRecueillies = await fetch(
        `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/userList.json`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!donneesRecueillies.ok) {
        toast.error("Une erreur est survenue dans ListTweet");
        return;
      }

      const donnees = await donneesRecueillies.json();
      //console.log("Les données recueillies devraient être affichées ici ", donnees);

      const donneesTransformees = [];
      // Avec cette boucle for in
      for (const key in donnees) {
        const newTweet = {
          id: key, // L'identifiant généré par firebase est maintenant une valeur de l'id que je crée
          ...donnees[key],
        };
        // push sert à ajouter dans le tableau de donneesTransformees le contenu de newTweet.
        donneesTransformees.push(newTweet);
      }
      //console.log("donnees transformees : ", donneesTransformees);

      setListeFollow([...donneesTransformees]); // Mise à jour du state de listeTweet
      setLoading(false);
    };

    requete();
  }, []);

  // Filtre les tweets écrits par les auteurs suivis
  const tweetsAuteursSuivis = listeFollow.filter((tweet) =>
    followListOfConnectedUser
      ? followListOfConnectedUser.includes(tweet.mailUser)
      : false
  );
  //console.log(`Contenu de tweetsAuteursSuivis `, tweetsAuteursSuivis);

  return (
    <section className="conversationWith">
      <p style={{marginBottom:"0.5rem"}}>Les auteurs que vous suivez :</p>
      {/* Bloc pour afficher seulement les noms des auteurs suivis */}
      {tweetsAuteursSuivis && tweetsAuteursSuivis.length > 0 ? (
        <ul>
          {tweetsAuteursSuivis.map((author) => (
            <li
              className="divAuthorFollowed"
              key={author.id}
              style={{ textTransform: "capitalize" }}
            >
              <Link
                to={`/AuthorPage/${author.id}`}
                onClick={() => changeAuthorPage(true)}
                className="LinkListFollowed"
              >
                {author.pseudonymUser}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Vous ne suivez personne pour l'instant.</p>
      )}
    </section>
  );
}
