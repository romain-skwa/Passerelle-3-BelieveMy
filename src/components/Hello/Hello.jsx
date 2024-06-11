import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../store/AuthProvider";

export function SayHello() {
  // Variable
  const { user } = useContext(AuthContext);
  const {pseudonymConnectedUser,} = useContext(AuthContext);
  const [hour, setHour] = useState(new Date().getHours()); // Nouvelle variable pour stocker l'heure actuelle

  useEffect(() => {
    setHour(new Date().getHours()); // Mettre à jour l'heure actuelle
  }, []);

  let greeting;

  if (hour >= 18 || hour < 6) {
    greeting = "Bonsoir";
  } else {
    greeting = "Bonjour";
  }

  return (
    <>
      {user ? 
      (
        <div >
          {" "}
          {greeting}  <span style={{ textTransform: "uppercase", borderImage: "none" }}>{pseudonymConnectedUser}</span> {" "}
        </div>
      ) 
        : 
      (
        <div>
          {greeting}
        </div>
      )}
    </>
  );
}
