import Mainpage from "./component/_main";
import Tututudu from "./component/_max";


export default function Home() {
  // Generate a random number between 0 and 1
  const random = Math.random();

  // 10% chance to render Tututudu
  const shouldRenderTututudu = random < 0.1;

  return shouldRenderTututudu ? <Tututudu /> : <Mainpage />;
}
