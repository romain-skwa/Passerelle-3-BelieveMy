import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// Ce composant affiche le pseudonyme des utilisateurs à la place de leur identifiant unique ou leur mail.
// par exemple : "Alice" à la place de -NtuK2i7W-JGNcnr_fkY ou "alice@yahoo.fr"

export function GetAuthorTweet(props){
    // Variable
    const { tweet } = props;
    const [userList, setUserList] = useState();
  //  console.log(`userList depuis GetAuthorTweet ici : `, userList);
/***************************************************************************************************** */

    const requete = async () => {
    // Dans la variable const userlist, on va stocker le contenu récupéré sur Firebase
    const getUserlist = await fetch(
        `https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/userList.json`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!getUserlist.ok) {
        toast.error("Une erreur est survenue dans userTweet");
        return;
      }
  
      const userListData  = await getUserlist.json();

//console.log("Les données mailUser et pseudonymUser depuis GetAuthorTweet sont affichées ici ", userListData );     

      const donneesTransformees = [];
      // Avec cette boucle for in 
      for (const key in userListData) {
        const dataUserProfile = {
          id: key, // L'identifiant généré par firebase est maintenant une valeur de l'id que je crée
          ...userListData[key],
        };
        // push sert à ajouter dans le tableau de donneesTransformees le contenu de newTweet.
        donneesTransformees.push(dataUserProfile);
      }
      //console.log("donnees transformees GetAuthorTweet : ", donneesTransformees);
      setUserList([...donneesTransformees]);
    }

    useEffect(() => {
      requete();
    }, []);
    

    // Fonction pour itérer sur les éléments de userList
        const renderUserList = () => {
            if (!userList) {    
                return <div>Chargement...</div>;    
            }    
    
            return userList.map((dataUser, index) => {    
                if (tweet.author === dataUser.mailUser) {    
                    return (
                      <Link to={`/AuthorPage/${dataUser.id}`} key={dataUser.id}>
                      <span key={index} style={{ textTransform: 'capitalize' }}>{dataUser.pseudonymUser}</span>
                      </Link>
                    );
                }
            });
        };

return (
    <>
        {renderUserList()}
    </>
)
}