import { React, useState, useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaEllipsisVertical } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import FlipCard from "../components/FlipCard";

const FlashcardPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const touchStartX = useRef(null);
  const cardRef = useRef(null);

  // Sample flashcard data
  const flashcards = [
    {
      question: "What is React?",
      answer: "A JavaScript library for building UIs",
    },
    {
      question: "What is JSX?",
      answer:
        "A syntax extension to JavaScript that allows writing HTML-like code in React",
    },
    {
      question: "What is a React component?",
      answer:
        "A reusable piece of UI that can manage its own state and properties",
    },
    {
      question: "What is the Virtual DOM?",
      answer:
        "A lightweight copy of the actual DOM that React uses to optimize rendering",
    },
    {
      question: "What are React Hooks?",
      answer:
        "Functions that let you use state and other React features without writing a class",
    },
  ];

  // Custom navigation handlers
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
    setFlipped(false); // Reset to question side
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
    setFlipped(false); // Reset to question side
  };

  // Touch event handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    // Threshold for swipe detection (50px)
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped left, go to next card
        handleNext();
      } else {
        // Swiped right, go to previous card
        handlePrevious();
      }
    }

    touchStartX.current = null;
  };

  // Handle flip card click - only flip if not swiping
  const handleCardClick = (e) => {
    // If we're in the middle of a swipe, don't flip
    if (touchStartX.current !== null) return;

    // Calculate if this is a small movement (click) or large (swipe)
    const movementX = Math.abs(e.movementX || 0);
    const movementY = Math.abs(e.movementY || 0);

    // Only flip if it's a true click (minimal movement)
    if (movementX < 5 && movementY < 5) {
      setFlipped((prev) => !prev);
    }
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === " " || e.key === "Enter") {
        setFlipped((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <section className="bg-matte-black py-10 min-h-screen">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-xl md:text-2xl font-semibold text-white">
            CSCI 121 Exam 3 Module 14
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="cursor-pointer">
                <FaEllipsisVertical className="w-4 h-4 bg-white text-black" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                  <FaPen className="mr-2 h-4 w-4" />
                  Edit Studyset
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <FaRegTrashAlt className="mr-2 h-4 w-4" />
                  Delete Studyset
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Card counter */}
        <div className="text-white text-center mb-4">
          Card {currentIndex + 1} of {flashcards.length}
        </div>

        {/* Touch instructions for mobile */}
        <div className="text-white text-center text-sm mb-4 md:hidden">
          Swipe left/right to navigate • Tap to flip
        </div>

        {/* Single Flashcard with Custom Navigation */}
        <div
          className="relative"
          ref={cardRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <FlipCard
            flipped={flipped}
            onClick={handleCardClick}
            front={
              <span className="text-lg md:text-2xl font-semibold">
                Q: {flashcards[currentIndex].question}
              </span>
            }
            back={
              <span className="text-lg md:text-2xl font-semibold">
                A: {flashcards[currentIndex].answer}
              </span>
            }
          />

          {/* Custom navigation buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white text-black p-2 rounded-full cursor-pointer shadow-lg hidden lg:block"
            aria-label="Previous card"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white text-black p-2 rounded-full cursor-pointer shadow-lg hidden lg:block"
            aria-label="Next card"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Mobile navigation buttons as fallback */}
        <div className="flex justify-center gap-4 mt-6 lg:hidden">
          <Button
            onClick={handlePrevious}
            variant="outline"
            className="bg-white text-black"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            variant="outline"
            className="bg-white text-black"
          >
            Next
          </Button>
        </div>

        {/* Keyboard shortcut hint */}
        <div className="text-white text-center text-xs mt-6 hidden md:block">
          Keyboard shortcuts: ← Previous • → Next • Space/Enter to Flip
        </div>
      </div>
    </section>
  );
};

export default FlashcardPage;
