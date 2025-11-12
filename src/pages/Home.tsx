import { Header } from '../components/home/Header';
import { Carousel } from '../components/home/Carousel';
import { TervisAI } from '../components/home/TervisAI';
import { ServicesCarousel } from '../components/home/ServicesCarousel';
import { Testimonials } from '../components/home/Testimonials';
import { HealthNews } from '../components/home/HealthNews';
import { Footer } from '../components/home/Footer';

export function Home() {
  return (
    <>
      <Header />
      <Carousel />
      <TervisAI />
      <ServicesCarousel />
      <HealthNews />
      <Testimonials />
      <Footer />
    </>
  );
}
