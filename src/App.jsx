import Connexion from "./pages/Connexion";
import Home from "./pages/Home";
import Error from "./pages/Error";
import Zut from "./pages/Zut";
import Envoi from "./pages/Envoi";
import Essai from "./pages/Essai";
import Inscription from "./pages/Inscription";
import ChangeMyPseudo from "./pages/ChangeMyPseudo";
import Main from "./layouts/Main";
import { onAuthStateChanged } from "firebase/auth"; // on vérifie si l'état de l'utilisateur change
import { auth } from "./firebase";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useContext } from "react";
import { AuthContext } from "./store/AuthProvider";

import AuthorPage from "./pages/AuthorPage";

export default function App() {
  const { user, loading } = useContext(AuthContext);

  // Dès le composant est affiché, on vérifie si l'utilisateut est connecté
    //onAuthStateChanged va ajouter la variable (user). Si l'utilisateur est connecté, la valeur sera remplie.
    // S'il n'est pas connecté, la valeur sera vide.
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
      //  console.log(user);
      //  console.log("L'utilisateur est bien connecté. Son adresse mail est :  " + user.email);
      }
      else {console.log("NON connecté")}
    })
  }, [])
  // on va utiliser le routeur retourné ici
  return (
          <>
          <ToastContainer theme="dark" position="bottom-right" />
            <RouterProvider router={ createBrowserRouter([// va nous retourner un routeur
            {
              path: "/",
              element: <Main />,
              children: 
              [
                {
                  path: "/",
                  errorElement: <Error />, // En cas d'erreur, cette page est affichée
                  children: 
                  [
                    // La propriété children est un tableau qui rassemble toutes nos adresses
                    {
                      path: "/", // S'il n'y a rien après le "/"...
                      element: <Home />, //...alors la page d'accueil Home s'affiche
                    },
                    {
                      path: "/connexion",
                      element: <Connexion />, // La page de connexion et déconnexion
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
                    {
                      path: "/envoi",
                      element: <Envoi />,
                    },
                    {
                      path: "/ChangeMyPseudo",
                      element: <ChangeMyPseudo />,
                    },
                    {
                      path: "/AuthorPage/:authorId",
                      element: <AuthorPage />,
                    },
                  ],
                },
              ]
            }
            
          ])} />; 
          </>
          );
}