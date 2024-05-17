import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../store/AuthProvider";
import GridLoader from "react-spinners/GridLoader";
import Title from "../components/Title";
import { CoDecoLink } from "../components/NavBar";
import { SayHello } from "../components/Hello/Hello";
import Message from "../components/Message";
import  ListDialogue  from "../components/ListDialogue";

export default function Main() {
  // Variables
  const { loading,  } = useContext(AuthContext);

  if (loading) {
    return  (
      <>
        <Title/>
        <GridLoader color="#36d7b7" size={30} />
      </>     
    )
  }

  return (
    <main>
        <ListDialogue />

      <section style={{position:"fixed", top:"6vh", left:"15vw"}}>
        <SayHello />
        <CoDecoLink />
      </section>
      
      <Message />
      <Outlet />
      
    </main>
  );
}
