
import { useRef, useState } from "react";

export default function Zut() {
  // StateFormulaire
 const [premier, setPremier] = useState(" Il y aura le nouveau mot")

  // Variables
  const mot = useRef();

  // Fonction
 const envoyer  = ()=> {
  setPremier(mot.current.value);
 }
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

            <div>
              On affiche : {premier}
            </div>
    </div>
  );
}
