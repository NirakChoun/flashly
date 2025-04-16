import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-2 px-4 border-t border-border bg-background text-foreground">
      <div className="container max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-black text-center sm:text-left">
          © {new Date().getFullYear()} Flashly. Built by Nirak Choun.
        </p>
        <div className="flex items-center gap-4">
          <Link
            to="https://github.com/NirakChoun"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
          >
            <FaGithub className="text-xl" />
            <span>GitHub</span>
          </Link>
          <Link
            to="https://www.linkedin.com/in/chan-nirak-choun-9a14612a0/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
          >
            <FaLinkedin className="text-xl" />
            <span>LinkedIn</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
