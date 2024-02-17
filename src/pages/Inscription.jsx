import { useRef } from "react";
import { Link } from "react-router-dom";

export default function Inscription(){

    // Les refs
    const email = useRef("");
    const password = useRef("");
    let isEmailValid = true;

    // Function
    const clicCreation = (creationAccount) => {// Quand on clique sur s'inscrire, ça exécute ceci
        creationAccount.preventDefault(); // pour ce code ne s'exécute qu'au clic du bouton s'inscrire
        console.log("Premier console.log " + email.current.value, password.current.value);
        
        //Pour vérifier si l'adresse mail est valide
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email.current.value)) {
            isEmailValid = false;
        }
        
        if (isEmailValid === true) {
            console.log("Deuxième console.log " + email.current.value, password.current.value)
        }else{
            console.log("Y aurait pas un problème dans le champ email ?")
        }

        // reset pour effacer le contenu des champs du formulaires une fois que les données sont envoyées
        creationAccount.target.reset(); 
        email.current.focus();// pour que le focus se fasse automatiquement après avoir envoyé les données        
    }
    return(
        <div>
            La page pour s&apos;inscrire

{/* La propriété onSubmit lancera la fonction clicCreation quand les données seront envoyées grace au clic du bouton s'inscrire*/}
            <form onSubmit={clicCreation}>
                <input 
                    type="email"
                    placeholder="Adresse e-mail"
                    className="input-inscription"
                    ref={email}
                    required
                    />
                <input type="password" placeholder="Mot de passe" className="input-inscription" ref={password}/>
                <button>S&apos;inscrire</button>
                <div>
                        <div>
                            <Link to="/codeco">Déjà un compte ?</Link>
                        </div>
                    </div>
            </form>
        </div>
    )
}