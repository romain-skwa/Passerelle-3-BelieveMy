import { useRef } from "react"

export default function Comparaison(){
  const inputUn = useRef(null)
  const inputDeux = useRef(null)

  const verification = () => {
    if(inputUn.current.value === inputDeux.current.value){
      console.log("C'est bon. C'est identique.")
    }else{
      console.log("C'est pas pareil !")
    }
  }

  return(
    <>
    <input type="text" ref={inputUn} />
    <input type="text" ref={inputDeux} />
    <button onClick={() => verification()}>Coucou</button>

    </>
  )
}