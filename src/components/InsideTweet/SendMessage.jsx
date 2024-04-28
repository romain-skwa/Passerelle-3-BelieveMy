import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import DeleteTweet from "../InsideTweet/DeleteTweet";
import ChangeThisTweet from "../InsideTweet/ChangeThisTweet";
import { GetAuthorTweet } from "../InsideTweet/GetAuthorTweet";
import { CheckUserAuthor } from "../InsideTweet/CheckUserAuthor";
import FollowThisUser from "../InsideTweet/FollowThisUser";
import Commentaries from "../InsideTweet/Commentaries";
import Liked from "../InsideTweet/Liked";
import Avatar from "../InsideTweet/Avatar";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";
import { Link } from "react-router-dom";

export default function ListTweet(props) {
// Variable
  const { user } = useContext(AuthContext);
  const { tweet } = props;
  const {
    idOfConnectedUser,
    pseudonymConnectedUser,
    mailOfConnectedUser,
    followListOfConnectedUser,
    likedListOfConnectedUser,
  } = useContext(AuthContext);
  const [preventFollowList, setpreventFollowList] = useState(
    followListOfConnectedUser || []
  );

  const conversation = async () =>{

    content
          // Ajouter dans firebase
          const response = await fetch(
            "https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/conversation.json",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newMessage),
            }
          );
      
          // Error
          if (!response.ok) {
            return "Une erreur est survenue. Impossible d'afficher la base de données.";
          }
          
  }
    return(
        <>
          <div>
            <label htmlFor="inputContentMessage">Contenu du tweet</label>
            <textarea
              cols="50"
              rows="10"
              name="inputContentMessage"
              id="inputContentMessage"
              ref={inputContentMessage}
              placeholder="Écrivez votre nouveau tweet ici."
              style={{ margin: "15px auto", padding: "5px", display: "block" }}
            />
          </div>        </>
    )
}