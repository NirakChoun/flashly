import React from "react";
import heroImg from "../assets/images/hero.svg";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="py-20 px-6">
      <div className="container max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        {/* Text */}
        <div className="max-w-xl space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-heading leading-tight">
            <span className="block text-green-500 font-bold">Study Smart</span>
            <span className="block text-red-500 font-bold">Study Flashly</span>
          </h1>
          <p className="text-lg text-white">
            Generate, organize, and study flashcards effortlessly with
            AI-powered tools.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <Button
              asChild
              className="bg-white text-black cursor-pointer hover:bg-gray-400"
              size="lg"
            >
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Image */}
        <div className="w-full max-w-md md:max-w-lg">
          <img
            src={heroImg}
            alt="Students studying with flashcards"
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
