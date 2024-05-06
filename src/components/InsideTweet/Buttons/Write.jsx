import { useContext, useState} from "react";
import { AuthContext } from "../../../store/AuthProvider";
import { Link } from "react-router-dom";
import { GetAuthorTweet } from "../GetAuthorTweet";

export default function Write(props) {
  // Variable
  const { user } = useContext(AuthContext);
  const { tweet } = props;
  const {
    mailOfConnectedUser,
    setRecipientMail,
  } = useContext(AuthContext);

  const handleWriteClick = () => {
    setRecipientMail(tweet.author);
  };
return(
    <>
        {
// Pour s'assurer que le bouton "Ecrire" ne s'affichera pas sous un tweet écrit par l'utilisateur connecté
// voici la condition suivante, si un utilisateur est bien connecté ET si le mail de cet utilisateur est différent du mail de l'auteur du tweet
// alors, on affiche le bouton "Ecrire à ..."
        user && mailOfConnectedUser !== tweet.author ? 
          (
            <> 
              {/* ECRIRE A L'AUTEUR DU TWEET */}
              <Link to={`/WriteOneMessage/${tweet && tweet.id}`} onClick={handleWriteClick} key={tweet.id}>
                  <span >
                      Ecrire à{" "}
                      <GetAuthorTweet /* Composant affichant le PSEUDONYME ;*/
                        tweet={tweet}
                        cancelLink={true} 
                      />
                  </span>
              </Link>
            </>
          ) :   null
        }
  </>)
}