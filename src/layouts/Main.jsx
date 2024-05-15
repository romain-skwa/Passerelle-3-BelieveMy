import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../store/AuthProvider";
import GridLoader from "react-spinners/GridLoader";
import Title from "../components/Title";
import { CoDecoLink } from "../components/NavBar";
import { SayHello } from "../components/Hello/Hello";
import AlertMessage from "../components/Message/AlertMessage";
import Message from "../components/Message";

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

      <section style={{position:"fixed", top:"6vh", left:"15vw"}}>
        <SayHello />
        <CoDecoLink />
      </section>

      <section style={{position:"fixed", top:"6vh", left:"70vw"}}>
        <AlertMessage />
      </section>

      
      <Message />
      <Outlet />
      
    </main>
  );
}
