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

    loginUser(data.email, data.password)
    .then((userCredential) => {
      setLoading(false);
      navigate("/");
    })
    .catch(error => {
      const { code, message} = error;
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
      <Title />
      {/* handleSubmit utilisé par React-hook-form va valider les données
    si tout est bon, les données sont envoyées sous forme de tableau dans boxData*/}
      <form onSubmit={handleSubmit(boxData)}>
        <input
          type="email"
          placeholder="Adresse e-mail"
          {...register("email", {
            required: true,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message:
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
          type="password"
          placeholder="Mot de passe"
          {...register("password", {
            required: true,
            minLength: {
              value: 5,
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
