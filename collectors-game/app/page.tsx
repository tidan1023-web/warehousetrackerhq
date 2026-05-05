import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Exhibition from "./components/Exhibition";
import Collector from "./components/Collector";
import Collection from "./components/Collection";
import Venues from "./components/Venues";
import Fotwrld from "./components/Fotwrld";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Exhibition />
      <Collector />
      <Collection />
      <Venues />
      <Fotwrld />
      <Footer />
    </main>
  );
}
