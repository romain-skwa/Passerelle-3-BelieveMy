import ChangeMyPseudo from "../components/MyProfile/ChangeMyPseudo";
import ChangeMyAvatar from "../components/MyProfile/ChangeMyAvatar";
import { useContext, useEffect } from "react";

import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../store/AuthProvider";

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
        </section>
    )
}