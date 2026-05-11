import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustedBy from "@/components/TrustedBy";
import FeaturedCourses from "@/components/FeaturedCourses";
import Features from "@/components/Features";
import CourseCatalog from "@/components/CourseCatalog";
import PathToMastery from "@/components/PathToMastery";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustedBy />
        <FeaturedCourses />
        <Features />
        <CourseCatalog />
        <PathToMastery />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
