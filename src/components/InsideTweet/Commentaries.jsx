
import { Link } from "react-router-dom";

export default function Commentaries(props){
    const { tweet } = props;

 
    return(
        <>
            <Link to={`/OneTweet/${tweet.id}`} key={tweet.id}>
                <span  style={{ textTransform: 'capitalize' }}>Commentaire</span>
            </Link>
        </>
    )
}