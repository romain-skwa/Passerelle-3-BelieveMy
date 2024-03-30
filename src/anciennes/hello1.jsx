import { auth } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";
import { onAuthStateChanged } from "firebase/auth";

export function SayHello() {
    // Variable
    const { user } = useContext(AuthContext);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("L'utilisateur est connecté " + user.email);
        }else{
            console.log("euhhhhhhhhhhhhhhhhhh... pas connecté")
    }})
    return (
      <div className="codeco">
        {user ?  <div> Bonjour . Votre adresse mail est  {user.email}</div> : <div>Bonjour</div>}
      </div>
    );
  }