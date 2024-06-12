import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";

export default function Description({idTarget}) {
  const { user, } = useContext(AuthContext);
  return (
    <>
      <div className="descriptiontOfTheConnectedUser">
            <img // Avatar
                style={{width:"100px", marginRight:"20px"}}
                src={user ? idTarget.avatar : "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fst3.depositphotos.com%2F4111759%2F13425%2Fv%2F450%2Fdepositphotos_134255634-stock-illustration-avatar-icon-male-profile-gray.jpg&f=1&nofb=1&ipt=636e3fbcf805042aebb4a071ed67afbf5d79ecb83625d1111894c7832208d33d&ipo=images"}
                alt="Avatar"   
            />
        {idTarget.description /* Description */}
      </div>
    </>
  );
}
