import ChangeMyPseudo from "../components/MyProfile/ChangeMyPseudo";
import ChangeMyAvatar from "../components/MyProfile/ChangeMyAvatar";

export default function MyProfile() {
    return(
        <section className="MyProfile">
        <ChangeMyPseudo />
        <ChangeMyAvatar />
        </section>
    )
}