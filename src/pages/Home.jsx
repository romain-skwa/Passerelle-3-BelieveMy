import Title from "../components/Title";
import FormWriteTweet from "../components/FormWriteTweet";
import ShowListTweet from "../components/ShowListTweet";
import { CoDecoLink } from "../components/CoDecoLink";

function Home() {
  return (
    <div>
      <Title />
      <CoDecoLink />
      <FormWriteTweet />
      <ShowListTweet />
    </div>
  );
}
export default Home;
