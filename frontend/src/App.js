import { useEffect, useState } from "react";
import Hero from "./components/Hero/Hero";
import DemoScreens from "./components/DemoScreens/DemoScreens";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import Install from "./components/Install/Install";
import Footer from "./components/Footer/Footer";
import Privacy from "./components/Privacy/Privacy";
import "./App.css";

function isPrivacyPath() {
  const path = (location.pathname || "/").replace(/\/+$/, "") || "/";
  if (path === "/privacy") return true;
  if ((location.hash || "").replace(/^#/, "") === "privacy") return true;
  return false;
}

function App() {
  const [privacy, setPrivacy] = useState(() => isPrivacyPath());

  useEffect(() => {
    const sync = () => setPrivacy(isPrivacyPath());
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, []);

  return (
    <div className="app">
      {privacy ? (
        <Privacy />
      ) : (
        <>
          <Hero />
          <DemoScreens />
          <HowItWorks />
          <Install />
        </>
      )}
      <Footer />
    </div>
  );
}

export default App;
