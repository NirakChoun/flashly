import React from "react";
import FileUpload from "./FileUpload";

const Hero = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-5 text-center flex-1 mt-10 px-5">
      <h1 className="text-3xl md:text-5xl lg:text-7xl">
        <span className="text-green-500">Study Smart</span>{" "}
        <span className="text-primary dark:text-red-500">Study Flashly</span>
      </h1>
      <p className=" md:text-xl lg:text-2xl">
        Easily and flashly generate flashcards from your study notes using AI
      </p>
      <FileUpload />
    </div>
  );
};

export default Hero;
