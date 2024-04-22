import { useParams } from "react-router-dom";
import {useEffect, useState} from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function Commentaries(props){
    const { tweet } = props;
    const [listeTweet, setListeTweet] = useState(); 
    const [loading, setLoading] = useState(false);

 
    return(
        <>
            <Link to={`/OneTweet/${tweet.id}`} key={tweet.id}>
                <span  style={{ textTransform: 'capitalize' }}>Commentaire</span>
            </Link>
        </>
    )
}