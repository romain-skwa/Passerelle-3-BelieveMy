import { useRef, useState } from "react";
import { GetAllIdUser } from "../components/Zut/GetAllIdUser";
import { GetOneIdUser } from "../components/Hello/GetOneIdUser";

export default function Zut() {
  // StateFormulaire
  const [premier, setPremier] = useState("Il y aura le nouveau mot");
  const [deuxieme, setDeuxieme] = useState("Texte deuxième");

  // Variables
  const mot = useRef();
  const texte = useRef();

  // Fonction
  const textavecretour = deuxieme.replace(/\n/g, "<br>");

  const envoyer = () => {
    setPremier(mot.current.value);
  };
  const envoiTexte = () => {
    setDeuxieme(texte.current.value);
  };

  return (
    <div>
      <section>
        {/*<input value={premier} onChange={(event) => setPremier(event.target.value)} />*/}
        <input ref={mot}></input>
        <div
          onClick={envoyer} // La fonction s'exécute quand on clique
        >
          <button>Nouveau tweet</button>
        </div>
      </section>

      <div>On affiche : {premier}</div>

      <section>
        <textarea
          value={deuxieme}
          onChange={(event) => setDeuxieme(event.target.value)}
          name="texte"
          id="texte"
          cols="50"
          rows="5"
        ></textarea>
        <button>Nouveau texte</button>
      </section>

      <div>On affiche le texte : {textavecretour}</div>
      <GetAllIdUser />
      <GetOneIdUser />
    </div>
  );
}
