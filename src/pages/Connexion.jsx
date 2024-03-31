import { Link } from "react-router-dom";
import Title from "../components/Title";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from "../store/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CoDeco() {
  // Variables
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { loginUser } = useContext(AuthContext);

  // State
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function
  const boxData = (data) => {
    // Quand on clique sur se connecter, ça exécute ceci
    console.log(data);
    if (loading) return;

    loginUser(data.email, data.password) // pour utiliser la fonction présente dans le contexte AuthContext servant à se connecter
    .then((userCredential) => {
      setLoading(false);
      navigate("/");
    })
    .catch(error => {
      const { code, message } = error;
      if(code == "auth/user-not-found"){
        toast.error("Cet email n'existe pas dans notre base de données.")
      }
      else if(code == "auth/invalid-credential"){
        toast.error("Cet email est incorrect.")
      }
      else{toast.error(message);}        
      setLoading(false);
    })
  };

  return (
    <div>
      {/* handleSubmit utilisé par React-hook-form va valider les données
    si tout est bon, les données sont envoyées sous forme de tableau dans boxData */}
      <form onSubmit={handleSubmit(boxData)}>{/* L'évènement onSubmit est déclenché quand on clique sur le bouton Se connecter 
      La fonction handleSubmit de react-hook-form est appelée en lui passant la fonction boxData en argument.
      handleSubmit valide toutes les entrées du formulaire en utilisant les règles de validation spécifiées avec register.
      Si toutes les entrées sont valides, handleSubmit appelle la fonction boxData en lui passant un objet contenant les valeurs des entrées du formulaire
      Si une ou plusieurs entrées ne sont pas valides, handleSubmit n'appelle pas la fonction boxData et affiche plutôt les messages d'erreur correspondants à côté des entrées non valides
      */}
        <input
          type="email"
          placeholder="Adresse e-mail"
          {...register("email", {
            required: true, // signifie que le champ en question doit être obligatoirement rempli
            pattern: { // sert à spécifier certaines choses précises
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, // indispensable pour avoir une adresse valide
              message: // message qui s'affichera en cas d'erreur
                "Renseignez une adresse email valide. Il y a un problème",
            },
          })}
        />
        {errors.email && (
          <p style={{ color: "red", fontSize: "12px", margin: "5px 0" }}>
            {errors.email.message}
          </p>
        )}

        <input
          type="password" // définir ce champ en password pour que les caractères entrés soient remplacés par des points noirs
          placeholder="Mot de passe"
          {...register("password", {
            required: true, // pour que ce champ soit obligatoirement rempli.
            minLength: { // pour exiger un nombre minimum de caractères
              value: 5, // Le nombre de caractères imposé.
              message: "Le mot de passe doit contenir au moins 5 caractères.",
            },
          })}
        />

        {errors.password && (
          <p style={{ color: "red", fontSize: "12px", margin: "5px 0" }}>
            {errors.password.message}
          </p>
        )}
        <button>Se connecter</button>

        <div>
          <Link to="/inscription">Créer un compte</Link>
        </div>
      </form>
      <div>
        <Link to="/"> Retour à l&apos;accueil</Link>
      </div>
    </div>
  );
}
