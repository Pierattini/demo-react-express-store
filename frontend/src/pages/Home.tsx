import Banner from "../components/layout/Banner";
import FeaturedProducts from "../components/home/FeaturedProducts";
import AboutSection from "../components/home/AboutSection";
import HowWeWork from "../components/home/HowWeWork";
import Testimonials from "../components/home/Testimonials";
import Newsletter from "../components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Banner />
      <FeaturedProducts />
      <AboutSection />
      <HowWeWork />
      <Testimonials />
      <Newsletter />
    </>
  );
}
