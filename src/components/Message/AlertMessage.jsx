import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";
import {GetAuthorTweet} from "../../components/InsideTweet/GetAuthorTweet";

const AlertMessage = () => {
  const [conversationSection, setConversationSection] = useState([]);
  const {
    user,
    mailOfConnectedUser,
    setToTheMail,
  } = useContext(AuthContext);


  useEffect(() => {
    if (user) {
      allTheConversations();
    }
  }, [user, mailOfConnectedUser]); // Ajout de user comme dépendance pour que l'effet soit réexécuté lorsque l'utilisateur se connecte


  //_________________________________________________________________________________________

  const allTheConversations = async () => {
    try {
      const getEverything = await fetch(
        `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/conversation.json`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!getEverything.ok) {
        toast.error("Une erreur est survenue dans userTweet");
        return;
      }
  
      const dataWithReadNotYet = await getEverything.json();
      const filteredData = Object.entries(dataWithReadNotYet).filter(([id, message]) => {
        return message.read === "notYet" && message.to === mailOfConnectedUser;  
      });
  
      setConversationSection(filteredData);

        } catch (error) {
      console.error("Erreur dans allTheConversations : ", error);
    }
  };
  
  //_________________________________________________________________________________________
//console.log(`conversationSection `,conversationSection)
  return (
    <>
    {user ?  // Si l'utilisateur est connecté. La liste de notifications pour les messages s'affiche
      <div className="conversationAlert">
        {conversationSection.map(([id, data]) => (
          <div key={id}>
            <div>
              Vous avez un messages de :
              <span onClick={() => setToTheMail(data.from)}>
               <GetAuthorTweet authorTweet={data.from} cancelLink={true} /> <br /> 
              </span>
            </div>
          </div>
        ))}
        </div> 
        : null /* Si aucun utilisateur n'est connecté, il n'y a rien*/}
    </>
  );
};

export default AlertMessage;