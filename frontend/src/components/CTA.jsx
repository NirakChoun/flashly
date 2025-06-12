import React from "react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-14 bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
          Ready to Transform Your Studying?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of students who are already studying smarter with
          AI-powered flashcards.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="relative inline-flex items-center justify-center group">
            <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:shadow-lg group-hover:shadow-cyan-500/50"></div>
            <Link
              to="/auth/register"
              className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gray-900 border border-transparent rounded-full"
            >
              Start Free Today
            </Link>
          </div>

          <p className="text-gray-400 text-sm">
            No credit card required • Free forever plan available
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
