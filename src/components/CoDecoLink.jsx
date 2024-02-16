import { Link } from "react-router-dom";

export function CoDecoLink() {
    return (
        <div className="codeco">
          <Link to="/inscription"> Inscription </Link>
          <Link to="/codeco"> Connexion / Déconnexion </Link>
        </div>
    )
}