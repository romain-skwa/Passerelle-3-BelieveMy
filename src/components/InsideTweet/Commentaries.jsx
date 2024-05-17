
import { Link } from "react-router-dom";
import CommentariesCounter from "./Buttons/CommentariesCounter";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";
/* 
    Lien vers la page où on peut écrire des commentaires sous les tweets
    Si l'utilisateur est connecté, le lien amène à la page où il pourra lire les commentaires et écrire le sien.
    S'il n'est pas connecté, le lien amène à la page de connexion.
*/
export default function Commentaries(props){
    const { tweet } = props;
    const { user } = useContext(AuthContext);

    return(
        <>
            {user ? ( // Si l'utilisateur est connecté
            <div className="commentaryIconCounter">
                <Link to={`/OneTweet/${tweet.id}`} key={tweet.id}>
                    <img className="commentaire" src="../../../icone/commentaire.png" alt="Commentaire" />
                </Link>
                
                <CommentariesCounter tweet={tweet} />
            </div>
        ) : (
            <Link to="/connexion"> {/* S'il n'est pas connecté */} 
                <div className="commentaryIconCounter">
                    <img className="commentaire" src="../../../icone/commentaire.png" alt="Commentaire" />
                    <CommentariesCounter tweet={tweet} />
                </div>
            </Link>
            )}
        </>
    )
}