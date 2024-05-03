import { useContext } from "react";
import { AuthContext } from "../../../store/AuthProvider";

export default function CommentariesCounter(props) {
  const { tweet } = props;
  const { allCommentaries } = useContext(AuthContext);

  const countCommentaries = () => {
    if (allCommentaries && tweet.id) {
      return Object.values(allCommentaries).filter(commentary => commentary.commentaryOf === tweet.id).length;
    } else {
      return 0;
    }
  };
  return (
    <>
        <div className="numberCommentaries">{countCommentaries()} </div>
    </>
  );
}