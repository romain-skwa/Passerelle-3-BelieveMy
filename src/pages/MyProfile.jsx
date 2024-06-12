import ChangeMyPseudo from "../components/MyProfile/ChangeMyPseudo";
import ChangeMyAvatar from "../components/MyProfile/ChangeMyAvatar";
import ChangeMyDescription from "../components/MyProfile/ChangeMyDescription";
import { useContext, useEffect } from "react";

import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../store/AuthProvider";
// Changer mon profil

export default function MyProfile() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => { // Sécurité : au cas où un utilisateur cherche à accéder directement à cette page sans être connecté
        if (!user) {
          navigate('/');
        }
      }, [user]);

    return(
        <section className="MyProfile">
        <ChangeMyPseudo />
        <ChangeMyAvatar />
        <ChangeMyDescription />
        </section>
    )
}