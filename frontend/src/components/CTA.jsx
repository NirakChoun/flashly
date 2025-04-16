import React from "react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-20 px-6 ">
      <div className="container max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-heading font-bold">
          Ready to level up your study game?
        </h2>
        <p className="text-lg max-w-xl mx-auto text-primary-foreground/80">
          Generate AI-powered flashcards in seconds and study smarter with
          Flashly.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="text-black bg-white">
            <Link to="/login">Get Started Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
