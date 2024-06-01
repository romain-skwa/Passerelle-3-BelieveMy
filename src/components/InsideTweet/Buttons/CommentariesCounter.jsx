import { useContext, useEffect } from "react";
import { AuthContext } from "../../../store/AuthProvider";

export default function CommentariesCounter(props) {
  const { tweet, listeCommentariesParent } = props;
  const { allCommentaries } = useContext(AuthContext);

  const countCommentariesFunction = () => {
    if (allCommentaries && tweet.id) {
      const countCommentaries = Object.values(allCommentaries).filter(commentary => commentary.commentaryOf === tweet.id).length;
      return countCommentaries;
    } else {
      return 0;
    }
  };

  const countCommentaries = countCommentariesFunction();

  useEffect(() => {
    countCommentariesFunction(); // Mettre à jour le compteur de commentaires lorsque listeCommentariesUpdated change  
  }, [listeCommentariesParent]); 



  return (
    <>
        <div className="numberCommentaries">{countCommentaries} </div>
    </>
  );
}