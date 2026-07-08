import Header from "../components/header/Header";
import Hero from "../components/hero/Hero";
import Services from "../components/services/Services";
import FeaturedProjects from "../components/projects/FeaturedProjects";
import Technologies from "../components/technologies/Technologies";
import Pricing from "../components/pricing/Pricing";
import About from "../components/about/About";
import Contact from "../components/contact/Contact";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Services />
        <FeaturedProjects />
        <Technologies />
        <Pricing />
        <About />
        <Contact />
      </main>
    </>
  );
}
