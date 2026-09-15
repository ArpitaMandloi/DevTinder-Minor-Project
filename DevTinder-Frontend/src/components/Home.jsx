
import Community from "./Community";
import CTA from "./CTA";
import Features from "./Features";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks"
import { useOutletContext } from "react-router-dom";

const Home = () => {
  const { isDarkMode } = useOutletContext();
  return (
    <>
    <Hero />

    <Features isDarkMode={isDarkMode}/>

  <HowItWorks isDarkMode={isDarkMode}/>

  <Community isDarkMode={isDarkMode}/>

  <CTA isDarkMode={isDarkMode}/>
  </>
  )

};

export default Home;