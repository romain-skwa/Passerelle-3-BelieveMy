import { useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";
// Nous sommes dans un composant enfant lui-même étant dans le composant parent ListTweet
// Si l'utilisateur connecté est l'auteur de certains tweets, un bouton permettant de modifier ces tweets apparaitra.
// Nous sommes à l'intérieur de listeTweet.map

export function CheckUserAuthor(props) {
  // Variable
  const { user } = useContext(AuthContext);
  const { tweet, handleFrameChangeTweet } = props;

  return (
    <div>
      {/* Si un utilisateur est connecté,
    son adresse mail (user.email) qui est son identifiant unique se trouvant dans authentification
    va être comparé la donnée tweet.author se trouvant dans realtime database. author est également une adresse email.
    tweet.author est l'identifiant de l'auteur du mail.
    Quand user.email === tweet.author, cela signifie que le tweet en question a été écrit par l'utilisateur connecté.
*/}
      {user && user.email === tweet.author ? (
        <>
          <button onClick={() => handleFrameChangeTweet(tweet.id)}>
            Modifier
          </button>
        </>
      ) : (
        null
      )}
    </div>
  );
}
