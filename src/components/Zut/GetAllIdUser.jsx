import { toast } from "react-toastify";
import { auth } from "../../firebase";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../store/AuthProvider";
import { onAuthStateChanged } from "firebase/auth";

export function GetAllIdUser() {
  // Variable
  const { user } = useContext(AuthContext);
  const [userList, setUserList] = useState();
  //console.log(`userList dans GetAllUser : `, userList);

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

    const userListData = await getUserlist.json();

    //console.log("Les données recueillies dans la partie userList devraient être affichées ici ", userListData);

    const donneesTransformees = [];
    // Avec cette boucle for in ... aye aye Je n'ai pas encore compris exactement comment ça marche
    for (const key in userListData) {
      const dataUserProfile = {
        id: key, // L'identifiant généré par firebase est maintenant une valeur de l'id que je crée
        ...userListData[key],
      };
      // push sert à ajouter dans le tableau de donneesTransformees le contenu de newTweet.
      donneesTransformees.push(dataUserProfile);
    }
    //console.log("donnees transformees : ", donneesTransformees);
    setUserList([...donneesTransformees]);
  };

  useEffect(() => {
    requete();
  }, []);

  return (
    <div>
      {userList &&
        userList.map((dataUser, index) => (
          <div key={index}>
            <p>Le idUser est censé être affiché ici : {dataUser.mailUser}</p>
            <p>
              Le pseudonymUser est censé être affiché ici :{" "}
              {dataUser.pseudonymUser}
            </p>
          </div>
        ))}
    </div>
  );
}
