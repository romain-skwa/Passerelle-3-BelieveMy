import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";

export default function Home() {
  const [errorMessagePasswords, setErrorMessagePasswords] = useState();
  // States
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // register sert enregistrer le champ du formulaire
  // handleSubmit sert à envoyer le contenu du formulaire
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // CRÉATION DES DONNÉES D'UN NOUVEL UTILISATEUR
  const sendDataToFirebase = async (data) => {
    if (data.password !== data.passwordConfirm) {
      //console.log("Les deux champs de mot de passe ne sont pas identiques.");
      setErrorMessagePasswords(
        "Les deux champs de mot de passe doivent être identiques."
      );
      return;
    }

    if (loading) return;
    setLoading(true);
    /*
  Dans create..., on utilise l'argument auth, puis l'email, puis le mot de passe. Firebase va créer notre utilisateur.
  Ensuite, userCredential va récupérer le fait que l'utilisateur est bien connecté.
  Dans user, on stocke l'utilisateur.
*/
    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        setLoading(false);
        navigate("/?success=true"); // Quand l'utilisateur a bien été inscrit.
      })
      .catch((error) => {
        const { code, message } = error;
        if (code == "auth/email-already-in-use") {
          toast.error("Cet email est utilisé.");
        } else {
          toast.error(message);
        }
        setLoading(false);
      });

    /************* Création des données concernant l'utilisateur dans Realtime Database *************************************/
    /*
Ici, les données créées seront envoyées dans RealtimeDatabase.
On y envoie l'adresse mail qui servira d'identifiant permanent
Et le pseudo choisi par l'utilisateur. Ce pseudo pourra être changer n'importe quand. C'est pour cette raison qu'il ne servira pas d'identifiant.
*/
    const userData = {
      pseudonymUser: data.pseudonymUser,
      mailUser: data.email,
      followList: [],
      avatar: data.avatar,
      description: data.description,
    };

    const newUser = await fetch(
      // Une nouvelle section  dans realtime database : userList.
      "https://projet-passerelle-3-believemy-default-rtdb.europe-west1.firebasedatabase.app/userList.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    // Error
    if (!newUser.ok) {
      return "Une erreur est survenue. Impossible d'afficher la base de données.";
    }

    const { name: idRandom } = await newUser.json();
    // console.log("Le data.name généré aléatoirement dans Firebase par FormWriteTweet " + idRandom);
  };
  return (
    <div className="cadreInscription">
      <span className="partOfcadreInscription">S&apos;inscrire</span>
      {/*------------- Form -----------------------------------------------------------------*/}
      <form onSubmit={handleSubmit(sendDataToFirebase)}>
        <span className="partOfcadreInscription">
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
        </span>
        {/*------------- Pseudonym ----------------------------------------------------------------*/}
        <span className="partOfcadreInscription">
          <input
            className={errors.pseudonymUser ? "invalid-input" : ""}
            type="text"
            placeholder="Pseudonyme"
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
        </span>
        {/*------------- password ----------------------------------------------------------------*/}
        <span className="partOfcadreInscription">
          <input
            className={errors.password ? "invalid-input" : ""}
            type="password"
            placeholder="Mot de passe"
            name="password"
            {...register("password", {
              required: true,
              minLength: {
                value: 5,
                message: "Le mot de passe doit contenir au moins 5 caractères",
              },
            })}
          />
          {errors.password && (
            <p style={{ color: "red", fontSize: "12px", margin: "5px 0" }}>
              {errors.password.message}
            </p>
          )}
        </span>
        {/*------------- password confirm -----------------------------------------------------------------*/}
        <span className="partOfcadreInscription">
          <input
            className={errors.password ? "invalid-input" : ""}
            type="password"
            placeholder="Confirmation de Mot de passe"
            name="passwordConfirm"
            {...register("passwordConfirm", {
              required: true,
              minLength: {
                value: 5,
                message: "Le mot de passe doit contenir au moins 5 caractères",
              },
            })}
          />
          {errors.password && (
            <p style={{ color: "red", fontSize: "12px", margin: "5px 0" }}>
              {errors.password.message}
            </p>
          )}
        </span>
        <br></br>

        {/*------------- FACULTATIF ---------------------------------------------------------------------*/}

        {/*------------- Avatar -------------------------------------------------------------------------*/}
        <span className="partOfcadreInscription">Facultatif</span>
        <br></br>
        <span className="partOfcadreInscription">
          <input
            className={errors.avatar ? "invalid-input" : ""}
            type="text"
            placeholder="Avatar : lien d'une image"
            name="avatar"
            {...register("avatar", {
              required: false,
              minLength: {
                value: 10,
                message:
                  "Etes-vous certain d'avoir entré un lien vers l'image correct ?",
              },
            })}
          />
          {errors.avatar && (
            <p style={{ color: "red", fontSize: "12px", margin: "5px 0" }}>
              {errors.avatar.message}
            </p>
          )}
        </span>
        {/*------------- Souhaitez-vous vous présenter ? ---------------------------------------------*/}
        <span className="partOfcadreInscription">
          <textarea
            className={errors.description ? "invalid-input" : ""}
            cols="29"
            rows="5"
            type="text"
            placeholder="Souhaitez-vous vous présenter ?"
            name="description"
            {...register("description", {
              required: false,
              minLength: {
                value: 10,
                message:
                  "Votre description est dispensable mais si vous souhaiter en écrire une, il faut faire un effort",
              },
              maxLength: {
                value: 150,
                message: "La description est limitée 150 caractères.",
              },
            })}
          />
          {errors.description && (
            <p style={{ color: "red", fontSize: "12px", margin: "5px 0" }}>
              {errors.avatar.message}
            </p>
          )}
        </span>
        {/*------------- Bouton Inscription --------------------------------------------------------------*/}
        <span className="partOfcadreInscription">
          <button>S&apos;inscrire</button>
        </span>
      </form>

      {/* Pass */}
      <div className="lastPartOfcadreInscription">
        <Link to="/">Déjà un compte ?</Link>
      </div>
    </div>
  );
}
