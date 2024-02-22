import { useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  // States
  //const [email, setEmail] = useState("");
  //const [password, setPassword] = useState("");

  // Refs
  const email = useRef("");
  const password = useRef("");
  // Function

  const whenIClick = (e) => {
    e.preventDefault();
    console.log(email.current.value, password.current.value);
  };
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
              ref={email}
            />
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
              <Link to="/">Pas de compte ?</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
