import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

function App() {
  const [dark, setDark] = useState(() => {
    // Load dark mode preference from local storage (persists between reloads)
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark"); // Apply dark mode to entire webpage
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);
  return (
    <div className="flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <Navbar dark={dark} setDark={setDark} />
      <main className="flex-1 ">
        <Hero />
      </main>
      <Footer className="hidden" />
    </div>
  );
}

export default App;
