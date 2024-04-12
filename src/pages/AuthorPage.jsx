import { useParams } from "react-router-dom";
import AuthorTweets from "../components/Author/AuthorTweets";

export default function AuthorPage() {
  const { authorId } = useParams();
console.log("Ce qu'on récupère dans useParams " + authorId)
  return (
    <div>
      <h1>Tweets de l'auteur {authorId}</h1>
      <AuthorTweets authorId={authorId} />
    </div>
  );
}