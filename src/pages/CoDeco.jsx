import { Link } from "react-router-dom";
import Title from "../components/Title";
import { useForm } from "react-hook-form";

export default function CoDeco() {
  // Variables
  const { register, handleSubmit, formState: { errors },} = useForm();

  // Function
  const boxData = (data) => {
    // Quand on clique sur se connecter, ça exécute ceci
    console.log(data);
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
              message: "Renseignez une adresse email valide. Il y a un problème",
            },
          })}
        />
        {errors.email && (
          <p style={{ color: "red", fontSize: "12px", margin: "5px 0" }}>{errors.email.message}</p>
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
          <p style={{ color: "red", fontSize: "12px", margin: "5px 0" }}>{errors.password.message}</p>
        )}
        <button>Se connecter</button>

        <div>
          <Link to="/codeco">Créer un compte</Link>
        </div>
      </form>
      <div>
        <Link to="/"> Retour à l&apos;accueil</Link>
      </div>
    </div>
  );
}
