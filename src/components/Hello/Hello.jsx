import { auth } from "../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";
import { onAuthStateChanged } from "firebase/auth";

export function SayHello() {
  // Variable
  const { user } = useContext(AuthContext);
  const {
    pseudonymConnectedUser,
  } = useContext(AuthContext);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      //  console.log("L'utilisateur est connecté " + user.email);
    } else {
    //  console.log("euhhhhhhhhhhhhhhhhhh... pas connecté");
    }
  });
  return (
    <div className="apparition">
      {user ? 
      (
        <div >
          {" "}
          Bonjour <span style={{ textTransform: "uppercase" }}>{pseudonymConnectedUser}</span> {" "}
        </div>
      ) 
        : 
      (
        <div>
          Bonjour
        </div>
      )}
    </div>
  );
}
