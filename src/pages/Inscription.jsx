import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";

export default function Home() {
 const [errorMessagePasswords, setErrorMessagePasswords] = useState();
  // States
  const { register, handleSubmit,formState: { errors },} = useForm();
  // register sert enregistrer le champ du formulaire
  // handleSubmit sert à envoyer le contenu du formulaire
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
/*
  Dans create..., on utilise l'argument auth, puis l'email, puis le mot de passe. Firebase va créer notre utilisateur.
  Ensuite, userCredential va récupérer le fait que l'utilisateur est bien connecté.
  Dans user, on stocke l'utilisateur.
*/
  // Function




  const sendDataToFirebase = async (data) => {

    if (data.password !== data.passwordConfirm) {

      console.log("Les deux champs de mot de passe ne sont pas identiques.");
      setErrorMessagePasswords("Les deux champs de mot de passe doivent être identiques.")
      return;

    }

    if (loading) return;
    setLoading(true);

    await createUserWithEmailAndPassword(auth, data.email, data.password, data.name).then(
      (userCredential) => {
        const user = userCredential.user;
        setLoading(false);
        navigate("/?success=true");// Quand l'utilisateur a bien été inscrit.
      })
      .catch(error => {
        const { code, message} = error;
        if(code == "auth/email-already-in-use"){
          toast.error("Cet email est utilisé.")
        }
        else{toast.error(message);}        
        setLoading(false);
      })
    ;
  };
  return (
    <>
      <div className="flex flex-col gap-10 justify-center items-center min-h-screen">
        <div className="element lg:w-[400px] w-full">
          <div className="text-center text-lg mb-5">
            S&apos;inscrire
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit(sendDataToFirebase)}>
            <input
              style={errors.email && { background: "red" }}
              type="email"
              placeholder="Adresse e-mail"
              // register va gérer cet input
              {...register("email", {
                required: true,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Veuillez renseigner une adresse Valide et vite.",
                },
              })}
            />
            {errors.email && (
              <p style={{ color: "red", fontSize: "12px", margin: "5px 0" }}>
                {errors.email.message}
              </p>
            )}


            <input
            className={errors.password ? "invalid-input" : ""}
              type="text"
              placeholder="Mot de passe"
              name="password"
              {...register("password", {
                required: true,
                minLength: {
                  value: 5,
                  message:
                    "Le mot de passe doit contenir au moins 5 caractères",
                },
              })}
            />
            {errors.password && (
              <p style={{ color: "red", fontSize: "12px", margin: "5px 0" }}>
                {errors.password.message}
              </p>
            )}
            

            <input
            className={errors.password ? "invalid-input" : ""}
              type="text"
              placeholder="Mot de passe"
              name="passwordConfirm"
              {...register("passwordConfirm", {
                required: true,
                minLength: {
                  value: 5,
                  message:
                    "Le mot de passe doit contenir au moins 5 caractères",
                },
              })}
            />
            {errors.password && (
              <p style={{ color: "red", fontSize: "12px", margin: "5px 0" }}>
                {errors.password.message}
              </p>
            )}


            <button>S&apos;inscrire</button>
            <div style={{ color: "red" }}>{errorMessagePasswords}</div>
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
  )
}