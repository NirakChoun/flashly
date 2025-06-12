import React from "react";
import { BackgroundLines } from "./ui/background-lines";
import Navbar from "./Navbar";

const Hero = () => {
  return (
    <BackgroundLines className="bg-gray-900 dark:bg-gray-900">
      <div className="relative z-10">
        <section className="py-8 sm:py-16 lg:py-20">
          <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col items-center justify-center text-center py-16 sm:py-20 lg:py-24">
              <p className="text-sm font-normal tracking-widest text-gray-400 uppercase">
                Smart flashcard generator, made for Students
              </p>
              <h1 className="mt-6 text-4xl font-normal text-white sm:mt-10 sm:text-5xl lg:text-6xl xl:text-8xl max-w-4xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
                  Turn your study materials
                </span>{" "}
                into flashcards
              </h1>
              <p className="max-w-2xl mt-8 text-xl font-normal text-gray-300 sm:mt-12">
                Upload your PDFs, documents, or notes and let AI automatically
                generate personalized flashcards to boost your learning
                efficiency.
              </p>
              <div className="relative inline-flex items-center justify-center mt-12 sm:mt-16 group">
                <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:shadow-lg group-hover:shadow-cyan-500/50"></div>
                <a
                  href="/signup"
                  title=""
                  className="relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-white bg-gray-900 border border-transparent rounded-full"
                  role="button"
                >
                  Start Creating Flashcards
                </a>
              </div>

              <p className="mt-8 text-base font-normal text-gray-400">
                Free to start · AI-powered · Upload PDFs
              </p>
            </div>
          </div>
        </section>
      </div>
    </BackgroundLines>
  );
};

export default Hero;
