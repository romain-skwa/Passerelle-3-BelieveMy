import { auth } from "../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";
import { onAuthStateChanged } from "firebase/auth";
import { GetOneIdUser } from "./GetOneIdUser";

export function SayHello() {
  // Variable
  const { user } = useContext(AuthContext);
  const {
    idOfConnectedUser,
    pseudonymConnectedUser,
    mailOfConnectedUser,
    followListOfConnectedUser,
    likedListOfConnectedUser,
  } = useContext(AuthContext);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      //  console.log("L'utilisateur est connecté " + user.email);
    } else {
    //  console.log("euhhhhhhhhhhhhhhhhhh... pas connecté");
    }
  });
  return (
    <div className="codeco apparition">
      {user ? (
        <div>
          {" "}
          Bonjour {pseudonymConnectedUser}{" "}
        </div>
      ) : (
        <div>Bonjour</div>
      )}
    </div>
  );
}
