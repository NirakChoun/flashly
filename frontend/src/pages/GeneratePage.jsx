import React from "react";
import generateImg from "../assets/images/generate.svg";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
// When a user clicks on the generate link
// After they submit their study file,
// redirect them to the newly generated flashcard page.

const GeneratePage = () => {
  return (
    <section className="py-20 px-6">
      <div className="container max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        {/* Text */}
        <div className="max-w-xl space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-heading leading-tight">
            <span className="block font-bold">Generate with AI</span>
          </h1>
          <p className="text-lg text-white">
            Upload your study notes and let our AI instantly turn them into
            smart, customizable flashcards. Save time, stay organized, and get
            ready to master your materials with ease.
          </p>

          <div className="flex justify-center md:justify-start gap-4">
            <Button
              asChild
              className="bg-green-500 text-black cursor-pointer hover:bg-green-600"
              size="lg"
            >
              <Link to="/upload">Upload File</Link>
            </Button>
          </div>
        </div>

        {/* Image */}
        <div className="w-full max-w-md md:max-w-lg">
          <img
            src={generateImg}
            alt="Students studying with flashcards"
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default GeneratePage;
