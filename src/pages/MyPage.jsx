import { useState } from "react";
import FormWriteTweet from "../components/FormWriteTweet";
import MyTweets from "../components/MyTweets";

// MyPage dans lequel nous sommes est le composant parent de MyTweets et de FormWriteTweet
// Il les contient.

function Home() {
  const [listeTweetUpdated, setListeTweetUpdated] = useState([]);
// La liste de tweets pourra être mise à jour grace à la fonction updateListeTweet qui sera exécutée dans FormWriteTweet,
// Donc la liste de tweets sera être mise à jour quand sera écrit un nouveau tweet.
  const updateListeTweet = (newTweet) => {
    setListeTweetUpdated((prevListeTweet) => [...prevListeTweet, newTweet]);
  };
  return (
    <div>
      <FormWriteTweet updateListeTweet={updateListeTweet} />
      <MyTweets listeTweetParent={listeTweetUpdated} /> {/* Les tweets écrits par l'utilisateur connecté */}
    </div>
  );
}
export default Home;

// J'ai volontairement marqué de noms différents listeTweetParent, listeTweetUpdated et listeTweet
// pour être certain d'avoir bien compris et pour les distinguer facilement quand je lirai le code plus tard
// Sans quoi, je me retrouvais avec des listeTweet partout !