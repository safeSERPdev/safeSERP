import Hero from "./components/Hero/Hero";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import Install from "./components/Install/Install";
import Footer from "./components/Footer/Footer";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Hero />
      <HowItWorks />
      <Install />
      <Footer />
    </div>
  );
}

export default App;
