import { useContext, useEffect, useState } from "react";
import FormWriteTweet from "../components/Middle/FormWriteTweet";
import MyOwnTweets from "../components/Middle/MyOwnTweets";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../store/AuthProvider";
import Description from "../components/Description";
// MyTweets dans lequel nous sommes est le composant parent de MyTweets et de FormWriteTweet
// Il les contient.

function Home() {
    // La liste de tweets pourra être mise à jour grace à la fonction updateListeTweet qui sera exécutée dans FormWriteTweet,
    // Donc la liste de tweets sera être mise à jour quand sera écrit un nouveau tweet.
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [listeTweetUpdated, setListeTweetUpdated] = useState([]);

  useEffect(() => { // Sécurité : au cas où un utilisateur cherche à accéder directement à cette page sans être connecté
    if (!user) {
      navigate('/');
    }
  }, [user]);

  const updateListeTweet = (newTweet) => {
    setListeTweetUpdated((prevListeTweet) => [...prevListeTweet, newTweet]);
  };

  return (
    <div>
      <FormWriteTweet updateListeTweet={updateListeTweet} />
      <Description />
      <MyOwnTweets listeTweetParent={listeTweetUpdated} />{" "}
      {/* Les tweets écrits par l'utilisateur connecté */}
    </div>
  );
}

export default Home;