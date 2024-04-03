import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";

export default function Home() {
 const [errorMessagePasswords, setErrorMessagePasswords] = useState();
  // States
  const { register, handleSubmit, formState: { errors },} = useForm();
  // register sert enregistrer le champ du formulaire
  // handleSubmit sert à envoyer le contenu du formulaire
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function
  const sendDataToFirebase = async (data) => {

    if (data.password !== data.passwordConfirm) {
      console.log("Les deux champs de mot de passe ne sont pas identiques.");
      setErrorMessagePasswords("Les deux champs de mot de passe doivent être identiques.")
      return;
    }

    if (loading) return;
    setLoading(true);
/*
  Dans create..., on utilise l'argument auth, puis l'email, puis le mot de passe. Firebase va créer notre utilisateur.
  Ensuite, userCredential va récupérer le fait que l'utilisateur est bien connecté.
  Dans user, on stocke l'utilisateur.
*/
    await createUserWithEmailAndPassword(auth, data.email, data.password).then(
      (userCredential) => {
        const user = userCredential.user;
        setLoading(false);        
        navigate("/?success=true");// Quand l'utilisateur a bien été inscrit.
      })
      .catch(error => {
        const { code, message } = error;
        if(code == "auth/email-already-in-use"){
          toast.error("Cet email est utilisé.")
        }
        else{toast.error(message);}        
        setLoading(false);
      });


/************************* Création d'un pseudonyme dans Realtime Database ********************************************************/
/*
Ici, les données créées seront envoyées dans RealtimeDatabase.
On y envoie l'adresse  mail qui servira d'identifiant permanent
Et le pseudo choisi par l'utilisateur. Ce pseudo pourra être changer n'importe quand. C'est pour cette raison qu'il ne servira pas d'identifiant.
*/
      const userData = {pseudonymUser : data.pseudonymUser, mailUser : data.email, followList : []}

      const newUser = await fetch(// Une nouvelle section  dans realtime database : userList.
        "https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/userList.json",
                    {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                }
            )
    
       // Error
          if(!newUser.ok) {
            return  "Une erreur est survenue. Impossible d'afficher la base de données.";        
        }
    
        const {name: idRandom} = await newUser.json();
        console.log("Le data.name généré aléatoirement dans Firebase par FormWriteTweet " + idRandom);
  };
  return (
    <>
      <div className="flex flex-col gap-10 justify-center items-center min-h-screen">
        <div className="element lg:w-[400px] w-full">
          <div className="text-center text-lg mb-5">
            S&apos;inscrire
          </div>
{/*------------- Form -----------------------------------------------------------------------------------*/}
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
{/*------------- Pseudonym -----------------------------------------------------------------------------------*/}
            <input
              className={errors.pseudonymUser ? "invalid-input" : ""}
              type="text"
              placeholder="Votre pseudonyme"
              name="pseudonymUser"
              {...register("pseudonymUser", {
                required: true,
                maxLength: {
                  value: 25,
                  message:
                    "Le mot de passe doit contenir au maximum 25 caractères",
                },
              })}
            />
            {errors.pseudonymUser && (
              <p style={{ color: "red", fontSize: "12px", margin: "5px 0" }}>
                {errors.pseudonymUser.message}
              </p>
            )}
{/*------------- password ----------------------------------------------------------------------------------*/}
            <input
              className={errors.password ? "invalid-input" : ""}
              type="password"
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
{/*------------- password confirm -----------------------------------------------------------------------------------*/}
            <input
              className={errors.password ? "invalid-input" : ""}
              type="password"
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

{/*------------- Bouton Inscription -----------------------------------------------------------------------------------*/}

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