import { Link } from "react-router-dom";
import Title from "../components/Title";
import { useForm } from "react-hook-form";

export default function CoDeco() {
  // Variables
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
          className="input-inscription"
          {...register("email", {
            required: true,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "Renseignez une adresse email valide.",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-400 mb-10">{errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="Mot de passe"
          className="input-inscription"
          {...register("password", {
            required: true,
            minLength: {
              value: 8,
              message: "Le mot de passe doit contenir au moins 8 caractères.",
            },
          })}
        />

        {errors.email && (
          <p className="text-red-400 mb-10">{errors.email.message}</p>
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
