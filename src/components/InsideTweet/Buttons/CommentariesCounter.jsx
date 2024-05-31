import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../store/AuthProvider";

export default function CommentariesCounter(props) {
  const { tweet, commentaryCount, setCommentaryCount } = props;
  const { allCommentaries } = useContext(AuthContext);
  //const [commentaryCount, setCommentaryCount] = useState();

  useEffect(() => {
    if (allCommentaries && tweet.id) {
      const count = Object.values(allCommentaries).filter(commentary => commentary.commentaryOf === tweet.id).length;
      setCommentaryCount(count);
    }
  }, [allCommentaries, tweet.id, ]);
  

  //console.log(`allCommentaries `, allCommentaries);
  console.log(`commentaryCount, le nombre de commentaires trouvés dans le fichier enfant CommentariesCounter `, commentaryCount);
  return (
    <>
      <div className="numberCommentaries">{commentaryCount} </div>
    </>
  );
}