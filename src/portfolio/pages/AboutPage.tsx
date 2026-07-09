import About from "../components/about/About";
import Experiences from "../components/about-page/Experiences";
import MyStory from "../components/about-page/MyStory";
import Technologies from "../components/technologies/Technologies";
import CareerHighlights from "../components/about-page/CareerHighlights";
import CoreValues from "../components/about-page/CoreValues";
import CtaBanner from "../components/about-page/CtaBanner";

export default function AboutPage() {
  return (
    <>
      <div className="pt-20">
        {/* Reuse the existing About component as the Hero for this page */}
        <About />
      </div>
      <Experiences />
      <MyStory />
      <Technologies />
      <CareerHighlights />
      <CoreValues />
      <CtaBanner />
    </>
  );
}
