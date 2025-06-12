import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        {/* Animated 404 Icon */}
        <motion.div
          className="mx-auto mb-8 w-32 h-32 relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Broken flashcard icon */}
          <svg
            className="w-full h-full text-cyan-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            {/* Break lines */}
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 8l8 8M16 8l-8 8"
              className="text-red-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            />
          </svg>
        </motion.div>

        {/* 404 Text */}
        <motion.p
          className="text-base font-semibold text-cyan-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          404 Error
        </motion.p>

        {/* Main heading */}
        <motion.h1
          className="mt-4 text-5xl font-bold tracking-tight text-white sm:text-7xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Page not found
        </motion.h1>

        {/* Description */}
        <motion.p
          className="mt-6 text-lg font-medium text-gray-300 sm:text-xl max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Oops! The flashcard you're looking for seems to have vanished into the
          digital void.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          className="mt-10 flex items-center justify-center gap-x-6 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          {/* Home button */}
          <Link
            to="/"
            className="group inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full hover:from-cyan-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg
              className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Back to Home
          </Link>

          {/* Create flashcards button */}
          <Link
            to="/auth/register"
            className="group inline-flex items-center text-sm font-semibold text-gray-300 hover:text-white transition-colors duration-200"
          >
            <svg
              className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create Flashcards
            <span
              className="ml-1 group-hover:translate-x-1 transition-transform duration-200"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </motion.div>

        {/* Fun facts */}
        <motion.div
          className="mt-12 p-6 bg-gray-800 rounded-2xl border border-gray-700 max-w-md mx-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-yellow-400 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-white">Did you know?</h3>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Studies show that spaced repetition with flashcards can improve
            long-term retention by up to{" "}
            <span className="text-cyan-400 font-semibold">200%</span>!
          </p>
        </motion.div>

        {/* Floating particles animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-30"
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 10,
              }}
              animate={{
                y: -10,
                x: Math.random() * window.innerWidth,
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear",
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
