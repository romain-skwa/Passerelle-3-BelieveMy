import { useState } from "react";
import FormWriteTweet from "../components/FormWriteTweet";
import ListTweet from "../components/ListTweet";

// Home dans lequel nous sommes est le composant parent de ListTweet et de FormWriteTweet
// Il les relie

function Home() {
  const [listeTweetUpdated, setListeTweetUpdated] = useState([]);
// La liste de tweets pourra être mise à jour grace à la fonction updateListeTweet qui sera exécutée dans FormWriteTweet
  const updateListeTweet = (newTweet) => {
    setListeTweetUpdated((prevListeTweet) => [...prevListeTweet, newTweet]);
  };
  return (
    <div>
      <FormWriteTweet updateListeTweet={updateListeTweet} />
      <ListTweet listeTweetParent={listeTweetUpdated} />
    </div>
  );
}
export default Home;

// J'ai volontairement marqué de noms différents listeTweetParent, listeTweetUpdated et listeTweet
// pour être certain d'avoir bien compris et pour les distinguer facilement quand je lirai le code plus tard
// Sans quoi, je me retrouvais avec des listeTweet partout !