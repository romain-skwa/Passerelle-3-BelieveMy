import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";
import { onAuthStateChanged } from "firebase/auth";

export function SayHello() {
    // Variable
    const { user, email } = useContext(AuthContext);
    let textHello = "";
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("On dirait que le gars est connecté " + user.email);
            textHello =`Bonjour  ${user.email}`;
        }else{
            console.log("euhhhhhhhhhhhhhhhhhh... pas connecté")
    }})
    return (
      <div className="codeco">
        {user ?  <div>{textHello}</div> :<div>Bonjour</div> } 
      </div>
    );
  }