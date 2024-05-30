import ChangeMyPseudo from "../components/MyProfile/ChangeMyPseudo";
import ChangeMyAvatar from "../components/MyProfile/ChangeMyAvatar";
import { useContext, useEffect } from "react";

import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../store/AuthProvider";

export default function MyProfile() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
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