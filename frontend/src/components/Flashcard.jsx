import React, { useRef } from "react";
import { FaRegTrashCan, FaCamera } from "react-icons/fa6";

const Flashcard = ({ card, index, onDelete, onUpdate, dragHandleProps }) => {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        onUpdate(card.id, "image", event.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="mb-6 bg-slate-800 rounded-lg overflow-hidden"
      {...dragHandleProps}
    >
      <div className="flex justify-between items-center bg-slate-700 py-3 px-6">
        <span>{index + 1}</span>
        <div className="flex space-x-2">
          <button
            className="cursor-grab text-xl p-2"
            {...dragHandleProps}
            aria-label="Drag Handle"
          >
            ≡
          </button>
          <button className="cursor-pointer" onClick={() => onDelete(card.id)}>
            <FaRegTrashCan />
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/2 p-2 mb-4 sm:mb-0">
          <input
            type="text"
            value={card.term}
            onChange={(e) => onUpdate(card.id, "term", e.target.value)}
            placeholder="Enter term"
            className="w-full bg-transparent border-b border-slate-700 p-2 text-white"
          />
          <div className="text-xs text-slate-400 mt-1">TERM</div>
        </div>
        <div className="w-full sm:w-1/2 p-2 flex">
          <div className="flex-grow">
            <input
              type="text"
              value={card.definition}
              onChange={(e) => onUpdate(card.id, "definition", e.target.value)}
              placeholder="Enter definition"
              className="w-full bg-transparent border-b border-slate-700 p-2 text-white"
            />
            <div className="text-xs text-slate-400 mt-1">DEFINITION</div>
          </div>
          <div
            onClick={handleImageClick}
            className="ml-4 flex items-center justify-center border border-dashed border-slate-600 w-16 h-16 rounded cursor-pointer hover:bg-slate-700 transition-colors"
          >
            {card.image ? (
              <img
                src={card.image}
                alt="Card"
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <div className="text-center">
                <div className="flex justify-center">
                  <FaCamera className="text-slate-400" />
                </div>
                <div className="text-xs text-slate-400">Image</div>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
