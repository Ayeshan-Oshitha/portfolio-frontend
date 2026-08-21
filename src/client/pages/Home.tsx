import Hero from "../components/hero/Hero";
import Services from "../components/services/Services";
import FeaturedProjects from "../components/projects/FeaturedProjects";
import Technologies from "../components/technologies/Technologies";
import Pricing from "../components/pricing/Pricing";
import About from "../components/about/About";
// Contact moved to its own page

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <FeaturedProjects />
      <Technologies />
      <Pricing />
      <About />
    </>
  );
}
