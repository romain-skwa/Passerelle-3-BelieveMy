import { useRef } from "react"

export default function Comparaison(){
  const inputUn = useRef(null)
  const inputDeux = useRef(null)

  const verification = () => {
    if(inputUn.current.value === inputDeux.current.value){
      console.log("C'est bon. C'est identique.")
    }else{
      console.log("C'est pas pareil !")
    }
  }

  const changeCounter = async () => {
    console.log("changeCounter function called");
    const newLikedCounterValue = { likedCounter: "Tireli pimpom test" };
  
    // Get the current tweet data
    const response = await fetch(
      `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/tweetList/-NuDjgCA8qtcJytnXoT1.json`
    );
    const tweetData = await response.json();
  
    // Update the likedCounter property
    tweetData.likedCounter = newLikedCounterValue.likedCounter;
  
    // Send a PUT request to replace the entire tweet object
    const putResponse = await fetch(
      `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/tweetList/-NuDjgCA8qtcJytnXoT1.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tweetData),
      }
    );
  
    if (!putResponse.ok) {
      const errorBody = await putResponse.json();
      console.error("Error:", errorBody.error);
    } else {
      console.log("Je viens de cliquer pour le PATCH");
    }
  }

  const likeThisTweet = async () => {
    console.log("Fonction likeThisTweet appelée");
  
    // Get the current value of likedCounter from Firebase
    const response = await fetch(
      `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/tweetList/-NuDjgCA8qtcJytnXoT1/likedCounter.json`
    );
    const currentLikedCounter = await response.json();
  
    // Increment the current value of likedCounter by 1
    const newLikedCounterValue = currentLikedCounter + 1;
  
    // Send a PUT request to replace the value in Firebase
    const putResponse = await fetch(
      `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/tweetList/-NuDjgCA8qtcJytnXoT1/likedCounter.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLikedCounterValue),
      }
    );
  
    if (!putResponse.ok) {
      const errorBody = await putResponse.json();
      console.error("Error:", errorBody.error);
    } else {
      console.log("J'incrémente LikedCounter dans le tweet ");
    }
  }
  return(
    <>
    <input type="text" ref={inputUn} />
    <input type="text" ref={inputDeux} />
    <button onClick={() => verification()}>Coucou</button>
    <button onClick={changeCounter}> J'aime ce tweet </button>
    <button onClick={likeThisTweet}> J'incrémente </button>
    </>
  )
}