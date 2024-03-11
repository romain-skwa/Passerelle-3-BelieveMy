import Title from "../components/Title";
import FormWriteTweet from "../components/FormWriteTweet";
import ListTweet from "../components/ShowListTweet";
import { CoDecoLink } from "../components/NavBar";
import { SayHello } from "../components/Hello";
import ImageUploader from '../components/ImageUploader';

function Home() {
  return (
    <div>
      <Title />
      <CoDecoLink />
      <SayHello />
      <FormWriteTweet />
      <ListTweet />
      {/*<ImageUploader />*/}

    </div>
  );
}
export default Home;
