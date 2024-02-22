import { useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  // States
  const [email, setEmail] = useState(""); // pour vérifier à chaque lettre tapée
  const [emailError, setEmailError] = useState();

  // Refs
  const password = useRef("");
  /* 
    On va vérifier si le champ est correctement rempli au moment où on en sort.
  */
 
  // Function
  const whenIClick = (e) => {
    e.preventDefault();
    let isValid = true;
    if (
      // si le champ email ne contient pas les caractères suivant isvalid = false
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
    ) {
      isValid = false;
    }

    if (isValid === true) {
      console.log(email, password.current.value);
    }

    //e.target.reset(); pour effacer les input une fois les données envoyées
  };
  const handleEmailVerification = () => {// se déclenche quand on sort du champ Email
    console.log("blur")
    if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) && email != ""
    ) {
      setEmailError("Veuillez renseigner une adresse valide.");
    }
    else{
      setEmailError("");
    }
  }
  return (
    <>
      <div className="flex flex-col gap-10 justify-center items-center min-h-screen">
        <div className="element lg:w-[400px] w-full">
          <div className="text-center text-lg mb-5">
            S'inscrire sur Facebook
          </div>
          {/* Form */}
          <form onSubmit={whenIClick}>
            <input
              type="text"
              placeholder="Adresse e-mail"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailVerification}// quand on sort de l'input, la fonction handle se lance
            />
            {emailError && (<p style={{color: "red", fontSize: "12px", margin: "5px 0"}}>{emailError}</p>)}
            <input
              type="password"
              placeholder="Mot de passe"
              className="input"
              ref={password}
            />
            <button>S'inscrire</button>
          </form>

          {/* Pass */}
          <div className="flex justify-center mt-5">
            <div className="text-blue-facebook hover:text-blue-500 duration-150 cursor-pointer">
              <Link to="/">Déjà un compte ?</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
