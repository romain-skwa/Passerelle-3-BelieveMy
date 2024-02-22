import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function Home() {
  // States
  const [emailError, setEmailError] = useState();
  const { register, handleSubmit, formState: {errors} } = useForm();
  // register sert enregistrer le champ du formulaire
  // handleSubmit sert à envoyer le contenu du formulaire

  // Refs
  //const email = useRef("");
  //const password = useRef("");

  // Function
  const whenIClick = (data) => {
    console.log(data);
    //e.target.reset(); pour effacer les input une fois les données envoyées
  };
  return (
    <>
      <div className="flex flex-col gap-10 justify-center items-center min-h-screen">
        <div className="element lg:w-[400px] w-full">
          <div className="text-center text-lg mb-5">
            S&apos;inscrire sur Facebook
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit(whenIClick)}>
            <input
              style={errors.email && {background: "red",}}
              type="email"
              placeholder="Adresse e-mail"
              // register va gérer cet input
              {...register("email", {
                required: true,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Veuillez renseigner une adresse Valide et vite."
                }
              })}
            />
            {errors.email && (
              <p style={{ color: "red", fontSize: "12px", margin: "5px 0" }}>
                {errors.email.message}
              </p>
            )}
            <input
            type="password"
              placeholder="Mot de passe"
              {...register("password", {
                required: true,
                minLength: { value: 5, message: "Le mot de passe doit contenir au moins 5 caractères"}
              })}
            />
             {errors.password && (
              <p style={{ color: "red", fontSize: "12px", margin: "5px 0" }}>
                {errors.password.message}
              </p>
            )}
            <button>S&apos;inscrire</button>
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
