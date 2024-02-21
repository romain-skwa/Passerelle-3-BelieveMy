import CoDeco from "./pages/CoDeco";
import Home from "./pages/Home";
import Error from "./pages/Error";
import Zut from "./pages/Zut";
import Essai from "./pages/Essai";
import Inscription from "./pages/Inscription";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  // va nous retourner un routeur
  {
    path: "/",
    errorElement: <Error />, // En cas d'erreur, cette page est affichée
    children: [
      // La propriété children est un tableau qui rassemble toutes nos adresses
      {
        path: "/", // S'il n'y a rien après le "/"...
        element: <Home />, //...alors la page d'accueil Home s'affiche
      },
      {
        path: "/codeco",
        element: <CoDeco />, // La page de connexion et déconnexion
      },
      {
        path: "/inscription",
        element: <Inscription />,
      },
      {
        path: "/zut",
        element: <Zut />,
      },
      {
        path: "/essai",
        element: <Essai />,
      },
    ],
  },
]);

export default function App() {
  // on va utiliser le routeur retourné ici
  return <RouterProvider router={router} />; // La propriété RouterProvider a pour paramètre un "router"
}
