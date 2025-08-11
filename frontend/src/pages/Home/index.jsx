import "./home_css/animation.css";
import Feature from "./Feature";
import Footer from "./Footer";
import Hero from "./Hero";
import Sage from "./Sage";
import WhyUs from "./WhyUs";

const Home = () => {
  return (
    <div>
      <Hero />
      <WhyUs />
      <Feature />
      <Sage />
      <Footer />
    </div>
  );
};

export default Home;
