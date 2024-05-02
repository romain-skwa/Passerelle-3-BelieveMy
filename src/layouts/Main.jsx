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
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <GridLoader color="#36d7b7" size={30} />; // J'arrive po à centrer
  }

  return (
    <main style={{position:"relative"}}>
      <Title />
      <CoDecoLink />
      <SayHello />
      <AlertMessage />
      <Message />
      <Outlet />
    </main>
  );
}
