import Navbar from "../components/Navbar";
import HeroSlider from "../components/HeroSlider";
import CategorySection from "../components/CategorySection";
import Testimonials from "../components/Testimonials";
// import Thermometer from "../components/Thermometer";
//import SeasonThermometer from "../components/SeasonThermometer";
import ThermometerBrowse from "../components/ThermometerBrowse";
import BrandShowcase from "../components/BrandShowcase";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSlider />
      <CategorySection />
       <div className="my-12 px-4">
        <ThermometerBrowse />
      </div>
      <Testimonials />
      <BrandShowcase />
      <Footer />
    </>
  );
}
