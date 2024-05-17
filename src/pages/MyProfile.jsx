import ChangeMyPseudo from "../components/MyProfile/ChangeMyPseudo";
import ChangeMyAvatar from "../components/MyProfile/ChangeMyAvatar";
import  ListDialogue  from "../components/ListDialogue";

export default function MyProfile() {
    return(
        <section className="MyProfile">
        <ChangeMyPseudo />
        <ChangeMyAvatar />
        </section>
    )
}