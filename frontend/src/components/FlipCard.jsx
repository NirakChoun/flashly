import React from "react";
import { motion } from "framer-motion";

const FlipCard = ({ flipped, front, back, onClick }) => {
  return (
    <motion.div
      className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] cursor-pointer perspective"
      onClick={onClick}
    >
      {/* Indicator */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white text-black text-xs font-medium px-3 py-1 rounded-full shadow-sm">
        {flipped ? "Answer" : "Question"}
      </div>

      {/* Front */}
      <motion.div
        className="absolute w-full h-full backface-hidden rounded-xl flex items-center justify-center bg-gray text-white text-center px-4"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {front}
      </motion.div>

      {/* Back */}
      <motion.div
        className="absolute w-full h-full backface-hidden rounded-xl flex items-center justify-center bg-gray text-white text-center px-4"
        animate={{ rotateY: flipped ? 0 : -180 }}
        transition={{ duration: 0.5 }}
        style={{
          transformStyle: "preserve-3d",
          rotateY: 180,
        }}
      >
        {back}
      </motion.div>
    </motion.div>
  );
};

export default FlipCard;
