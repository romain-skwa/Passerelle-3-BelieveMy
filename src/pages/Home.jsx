import Title from "../components/Title";
import FormWriteTweet from "../components/FormWriteTweet";
import ShowListTweet from "../components/ShowListTweet";
import { CoDecoLink } from "../components/NavBar";
import { SayHello } from "../components/Hello";

function Home() {
  return (
    <div>
      <Title />
      <CoDecoLink />
      <SayHello />
      <FormWriteTweet />
      <ShowListTweet />
    </div>
  );
}
export default Home;
