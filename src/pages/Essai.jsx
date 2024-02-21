import {  useState } from "react";
import { AffichageTweet } from "../components/Tweet";

export default function Essai(){
  
  // state Formulaire
  let [tweets, setTweets] = useState("");

  
        // Fonction
        const tweetsList = tweets.map((tweet) => {
          return (
            <AffichageTweet
            id=""
            key=""
            title={tweet.newTweetTitle}
            contentTweet={tweet.newTweetContent}
            authorTweet={tweet.newAuthorTweet}
          />
          );
        });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event);
    const name = event.target.content.value; // Création du nouveau nom avec ce qui est écrit dans l'input name
    const content = event.target.content.value; // Création du nouveau contenu avec ce qui est écrit dans l'input content
    const newTweet = {
      // création du nouveau tweet
      id: tweets[tweets.length - 1]?.id + 1 || 0,
      name,
      content,
    };
    addTweet(newTweet);
  };

  const addTweet = (newTweet) => {
    setTweets([...tweets, newTweet]);
  };

 
  return (
      <main>
            <form onSubmit={handleSubmit}>{/* pourquoi ça ne marche pas quand j'écris form ? */}
                <h3 style={{ textAlign: "center" }}>Ecrire un nouveau tweet</h3>

                  <label htmlFor="inputNewTweetTitle">Titre<br></br></label>
                  <input
                  type="text" 
                  name="inputNewTweetTitle" 
                  id="inputNewTweetTitle" 
                  size="50"
                  placeholder="Donnez un titre à votre tweet"
                  style={{margin: "15px auto", display : "block"}}
                  />

                <div>
                  <label htmlFor="inputNewTweetContent">Contenu du tweet</label>
                  <textarea 
                  cols = "50"
                  rows="10"
                  name="inputNewTweetContent" 
                  id="inputNewTweetContent" 
                  style={{ margin: "15px auto", padding: "5px", display : "block" }}
                  />
                </div>

                <div>
                  <input
                  type="text"
                  name="inputNewAuthorTweet"
                  id="inputNewAuthorTweet"
                  placeholder="Nom de l'auteur"
                  />
                </div>

                <div >
                  <button>Nouveau tweet</button>
                </div>                
            </form>

            {tweetsList}

      </main>
  );
}