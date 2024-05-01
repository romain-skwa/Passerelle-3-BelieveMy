import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DeleteTweet from "../components/InsideTweet/DeleteTweet";
import ChangeThisTweet from "../components/InsideTweet/ChangeThisTweet";
import { GetAuthorTweet } from "../components/InsideTweet/GetAuthorTweet";
import { CheckUserAuthor } from "../components/InsideTweet/CheckUserAuthor";
import FollowThisUser from "../components/InsideTweet/Buttons/FollowThisUser";
import Liked from "../components/InsideTweet/Buttons/Liked";
import Avatar from "../components/InsideTweet/Avatar";
import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";
import FormCommentary from "../components/Commentaries/FormCommentary";
import GetCommentaries from "../components/Commentaries/GetCommentaries";

// Nous sommes dans le parent de GetCommentaries qui récupère les commentaires d'un tweet et de 
// FormCommentary le formulaire pour écrire les commentaires.

export default function ListTweet(props) {
  // State
  const {IdTweet} = useParams();
  const [listeTweet, setListeTweet] = useState(); 
  //console.log(`listeTweet `, listeTweet);
  const [loading, setLoading] = useState(false);
  const [deleteNow, setDeleteNow] = useState(false); // sera changé quand on clique sur le bouton supprimer (dans le composant DeleteTweet)
  const [changethisTweetNow, setChangethisTweetNow] = useState(false); // sera changé quand on clique sur le bouton modifier (dans le composant ChangethisTweet)
  // Ce useState pour suivre l'état de chaque tweet (true - pour afficher ChangeThisTweet et false - pour afficher le bouton Modifier)
  const [frameChangeTweetState, setFrameChangeTweetState] = useState({}); /* sera changé dans la fonction handleFrameChangeTweet */
  const { user } = useContext(AuthContext);

// ------ Pour actualiser l'affichage des commentaires --------

  const [listeCommentariesUpdated, setListeCommentariesUpdated] = useState([]);
  const updateListeTweet = (newTweet) => {
    setListeCommentariesUpdated((prevListeTweet) => [...prevListeTweet, newTweet]);
  };
  // La liste de commentaires pourra être mise à jour grace à la fonction updateListeTweet qui sera exécutée à partir de FormCommentary,
  // Donc la liste de tweets sera être mise à jour quand sera écrit un nouveau commentaire.
  // listeCommentariesUpdated, qui est passé en props au composant GetCommentaries, sera alors mis à jour.
  // Dans GetCommentaries, un useEffect permettant d'afficher les commentaires à nouveau sera enclenché à chaque fois que listeCommentariesUpdated changera.

  //----------- Fonction -----------------------------------------------------------------------------------
  const requete = async () => {
    // REQUETE pour obtenir les tweets (Les titres, les contenus, nom de l'auteur)
    setLoading(true);
    toast("Chargement...");

    // Dans la variable const donneesRecueillies, on va stocker le contenu récupéré sur Firebase
    const donneesRecueillies = await fetch(
        `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/tweetList/${IdTweet}.json`,      
        {      
          method: "GET",      
          headers: {      
            "Content-Type": "application/json",      
          },      
        }      
      ).catch(error => {      
        console.error('Une erreur s\'est produite lors de la récupération des données :', error);      
        toast.error('Une erreur s\'est produite lors de la récupération des données');      
      });

    if (!donneesRecueillies.ok) {
      toast.error("Une erreur est survenue dans ListTweet");
      return;
    }

    const donnees = await donneesRecueillies.json();

    //console.log("donnees transformees : ", donneesTransformees);
    //console.log("Les donneesRecueillies ", donneesRecueillies);
    //console.log("Les données  ", donnees);

    setListeTweet([donnees]); // Mise à jour du state de listeTweet
    setLoading(false);
  };

  const handleFrameChangeTweet = (id) => {
    setFrameChangeTweetState((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Ici, on change le state de frameChangeTweetState (true/false) à la ligne 138
    }));
  };

  /*---------- USEEFFECT -------------------------------------------------------------------------------*/
  // Le useEffect en utilisé pour que la fonction requete ne soit exécutée que lorsqu'on le décide.
  useEffect(() => {
    requete();
  }, []); 

  /************************************************************************************************/
  //console.log(`listeTweet `, listeTweet)
  console.log(`l'identifiant du tweet généré par firebase`, IdTweet)
  
  return(
    <>
      <div className="affichageListeTweet">
          {listeTweet &&
          listeTweet.map((tweet) => (
          <div key={tweet.title} className="cadreTweet">

          {/*********** Avatar **** Titre ******************************************************************/}
              
              <section style={{ display: "flex", paddingBottom:"1rem" }}>
                  <Avatar tweet={tweet} />
                  <div style={{ display:"flex", alignItems:"center", fontWeight:"bold", }}>{tweet.title /* TITRE */}</div>
              </section>
          
          {/**** Image **********************************************************************************/}
              
              <section style={{ display: "flex", justifyContent:"center", paddingBottom:"1rem" }}>
                  {tweet.image && tweet.image !== "" ? <img style={{maxWidth: "100%"}} src={tweet.image} alt="Image du tweet" /> : null}
              </section>

          {/******** Contenu **** Modifier *** Cœur *** Like *** Date ****************************************/}

              <div className="cadreTweetContent">
                  {tweet.content /* CONTENU */}
              </div>

              <div>
              <div>L'id de ce tweet : {IdTweet /* ID du TWEET */} </div>

              {/* Si le frameChangeTweetState de CE tweet === true, on affiche ChangeThisTweet et le bouton Retour.
                  Sinon c'est le bouton Modifier qui sera affiché */}
              {frameChangeTweetState[tweet.id] ? (
                  <>
                  <ChangeThisTweet // TEXTAREA dans lequel on écrit les modifications du tweet + BOUTON d'envoi
                      IdTweet={IdTweet}
                      tweet={tweet}
                      changethisTweetNow={changethisTweetNow}
                      setChangethisTweetNow={setChangethisTweetNow}
                  />
                  <button onClick={() => handleFrameChangeTweet(tweet.id)}>
                      Retour
                  </button>
                  </>
              ) : (
                  <CheckUserAuthor // BOUTON pour faire apparaitre le textarea et CHANGER le TWEET (seulement le bouton)
                  tweet={tweet}
                  handleFrameChangeTweet={handleFrameChangeTweet}
                  />
              )}

              <div className="lineOfComponents">

                <div className="like" /* CONTENANT */>
                  <Liked IdTweet={IdTweet} tweet={tweet} requete={requete} /* Cœur */ />
                  <span>{tweet.likedCounter /* COMPTEUR */}</span>
                </div>

                <div>
                  {user ? (
                      <FollowThisUser tweet={tweet} /* BOUTON S'ABONNER */ />
                  ) : null}
                </div>

              </div>

              <div>
                  Écrit par <GetAuthorTweet tweet={tweet} /* PSEUDONYME */ />
                  {tweet.datePublication
                  ? ", le " + tweet.datePublication
                  : " Nous n'avons pas de date concernant ce tweet."}
                  {tweet.hourPublication ? " à " + tweet.hourPublication : null}
                  .{tweet.modified /* MENTION "MODIFIÉE" éventuelle */}
              </div>

              {/* J'envoie les props, les propriétés dans ce composant.
              Ces props permettent d'utiliser les données à l'intérieur de ce composant DeleteTweet qui fait office 
              de bouton "supprimer" */}
              <DeleteTweet
                  tweet={tweet}
                  setDeleteNow={setDeleteNow}
              ></DeleteTweet>
              </div>
          </div>
          ))} 
      </div>
        <section>
          <GetCommentaries IdTweet={IdTweet} listeCommentariesParent={listeCommentariesUpdated}  />
        </section>

        <section>
          <FormCommentary IdTweet={IdTweet} updateListeTweet={updateListeTweet} />
        </section>
    </>
  );
}
