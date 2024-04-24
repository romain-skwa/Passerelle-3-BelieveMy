import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Avatar(props) {
  // Variable
  const { tweet } = props;
  const [userList, setUserList] = useState();

  // Récupération des données
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
      //console.log("donnees transformees Avatar : ", donneesTransformees);
      setUserList([...donneesTransformees]);
    }

    useEffect(() => {
      requete();
    }, []);

        // Fonction pour itérer sur les éléments de userList
        const renderAvatar = () => {
          if (!userList) {  
              return     "Il n'y a pas userlist"
          }    
  
          return userList.map((dataUser, index) => {
            if (tweet.author === dataUser.mailUser) {          
              return (
                <img
                  key={dataUser.id}
                  className="avatar"
                  src={dataUser.avatar ? dataUser.avatar : "../../../icone/unknown-avatar-icon01.jpg"}          
                  alt="Avatar"   
                />
              );
            }
          });
      };
      
  return (
    <>
      {renderAvatar()}
    </>
  );
}
