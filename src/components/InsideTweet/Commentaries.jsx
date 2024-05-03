
import { Link } from "react-router-dom";
import CommentariesCounter from "./Buttons/CommentariesCounter";

export default function Commentaries(props){
    const { tweet } = props;
 
    return(
        <div className="commentaryIconCounter">
            <Link to={`/OneTweet/${tweet.id}`} key={tweet.id}>
                <img className="commentaire" src="../../../icone/commentaire.png" alt="Commentaire" />
            </Link>
            <CommentariesCounter tweet={tweet} />
        </div>
    )
}