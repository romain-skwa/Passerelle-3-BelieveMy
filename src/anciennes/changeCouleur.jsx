import { useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const un = useRef("");
  const deux = useRef("");
  const [emailError, setEmailError] = useState();
  const [colorAlert, setColorAlert] = useState("green");
  {/*
  useEffect(() => {
    if (
      // si le champ email ne contient pas les caractères suivant isvalid = false
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(un) && un != ""
    ) {
      setEmailError("Veuillez donner des mot de passe identiques ou ça va chier..");
    }
    else{
      setEmailError("");
    }
  }, [un]);
*/}

  const whenIClick = (e) => {
    e.preventDefault();
    setColorAlert("green");
    
    if(un.current.value === deux.current.value){
      console.log("Ils sont identiques. " + un.current.value, deux.current.value);
      setEmailError("Les mots de passe sont maintenant identiques.");
    }else{
      console.log("Il semble que les mots de passe ne sont pas identiques.");
      setEmailError("Les mots de passe ne sont pas les mêmes.");
      setColorAlert("red");
    }
  };

  // Function
 

  return (
    <>
      <div className="flex flex-col gap-10 justify-center items-center min-h-screen">
        <div className="element lg:w-[400px] w-full">
          <div className="text-center text-lg mb-5">
            S&apos;inscrire
          </div>
          {/* Form */}
          <div >

            <input
              type="text"
              placeholder="Mot de passe"
              ref={un}
  
            />
            <input
              type="text"
              placeholder="Mot de passe"
              ref={deux}
    
            />
            
            <button onClick={whenIClick}>Tentative</button>
            {emailError && (
                <p style={{
                  color: colorAlert, 
                  fontSize: "12px", 
                  margin: "5px 0",
                  }}>
                    {emailError}
                </p>)}

          </div>


        </div>
      </div>
    </>
  );
}
