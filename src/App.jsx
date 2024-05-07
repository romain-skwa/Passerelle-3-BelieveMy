import Connexion from "./pages/Connexion";
import Home from "./pages/Home";
import Error from "./pages/Error";

import Inscription from "./pages/Inscription";
import ChangeMyPseudo from "./components/MyProfile/ChangeMyPseudo";
import Main from "./layouts/Main";
import { onAuthStateChanged } from "firebase/auth"; // on vérifie si l'état de l'utilisateur change
import { auth } from "./firebase";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useContext } from "react";
import { AuthContext } from "./store/AuthProvider";

import AuthorPage from "./pages/AuthorPage";
import MyTweets from "./pages/MyTweets";
import MyFollowedAuthors from "./pages/MyFollowedAuthors";
import MyProfile from "./pages/MyProfile";
import OneTweet from "./pages/OneTweet";
import MessageBox from "./pages/WriteOneMessage";

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
      } else {
        //console.log("NON connecté");
      }
    });
  }, [ user, loading]);
  // on va utiliser le routeur retourné ici
  return (
    <>
      <ToastContainer theme="dark" position="bottom-right" />
      <RouterProvider
        router={createBrowserRouter([
          // va nous retourner un routeur
          {
            path: "/",
            element: <Main />,
            children: [
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
                    path: "/connexion",
                    element: <Connexion />, // La page de connexion et déconnexion
                  },
                  {
                    path: "/inscription",
                    element: <Inscription />,
                  },

                  {
                    path: "/ChangeMyPseudo",
                    element: <ChangeMyPseudo />,
                  },
                  {
                    path: "/MyTweets",
                    element: <MyTweets />,
                  },
                  {
                    path: "/AuthorPage/:authorId",
                    element: <AuthorPage />,
                  },
                  {
                    path: "/MyFollowedAuthors",
                    element: <MyFollowedAuthors />,
                  },
                  {
                    path: "/MyProfile",
                    element: <MyProfile />,
                  },
                  {
                    path: "/OneTweet/:IdTweet",
                    element: <OneTweet />,
                  },
                  {
                    path: "/WriteOneMessage/:tweetId",
                    element: <MessageBox />,
                  },
                ],
              },
            ],
          },
        ])}
      />
    </>
  );
}
