import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaArrowUp } from "react-icons/fa6";
import Flashcard from "../components/Flashcard.jsx";

const AddFlashcardPage = () => {
  // State for flashcard set
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [flashcards, setFlashcards] = useState([
    { id: 1, term: "", definition: "", image: null },
    { id: 2, term: "", definition: "", image: null },
    { id: 3, term: "", definition: "", image: null },
  ]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Function to add a new flashcard
  const addFlashcard = () => {
    const newId =
      flashcards.length > 0
        ? Math.max(...flashcards.map((card) => card.id)) + 1
        : 1;
    setFlashcards([
      ...flashcards,
      { id: newId, term: "", definition: "", image: null },
    ]);
  };

  // Function to delete a flashcard
  const deleteFlashcard = (id) => {
    if (flashcards.length <= 1) {
      setErrors({ flashcards: "You need at least one flashcard" });
      return;
    }
    setFlashcards(flashcards.filter((card) => card.id !== id));
  };

  // Function to update a flashcard
  const updateFlashcard = (id, field, value) => {
    setFlashcards(
      flashcards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card
      )
    );
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Validate title
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    // Validate at least one flashcard has content
    const hasContent = flashcards.some(
      (card) => card.term.trim() && card.definition.trim()
    );

    if (!hasContent) {
      newErrors.flashcards = "At least one flashcard must be filled out";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle drag and drop reordering
  const onDragEnd = (result) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    const reorderedFlashcards = Array.from(flashcards);
    const [removed] = reorderedFlashcards.splice(result.source.index, 1);
    reorderedFlashcards.splice(result.destination.index, 0, removed);

    // Update the IDs to maintain sequential order
    const updatedFlashcards = reorderedFlashcards.map((card, index) => ({
      ...card,
      id: index + 1,
    }));

    setFlashcards(updatedFlashcards);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Format data for API
      const flashcardSet = {
        title,
        description,
        flashcards: flashcards.map(({ term, definition, image }) => ({
          term,
          definition,
          image,
        })),
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Submitting data:", flashcardSet);

      // Handle success
      setSubmitSuccess(true);
      // Reset form or redirect
      setTimeout(() => {
        // You could redirect here or clear the form
        setTitle("");
        setDescription("");
        setFlashcards([
          { id: 1, term: "", definition: "", image: null },
          { id: 2, term: "", definition: "", image: null },
          { id: 3, term: "", definition: "", image: null },
        ]);
        setErrors({});
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting:", error);
      setErrors({
        submit: "Failed to create flashcard set. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-900 text-white py-4 sm:py-8">
      <div className="container max-w-5xl mx-auto px-2 sm:px-4">
        {/* Header with title and buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">
            Create a new flashcard set
          </h1>
          <div className="space-x-3">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-full text-white transition-colors ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </div>

        {/* Title input with error */}
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title"
            className={`w-full bg-slate-800 border ${
              errors.title ? "border-red-500" : "border-slate-700"
            } rounded p-3 text-white`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description input */}
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a description"
          className="w-full bg-slate-800 border border-slate-700 rounded p-3 mb-6 text-white"
        />

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-8 ">
          <button className="flex items-center px-4 py-2 border border-slate-700 rounded-full text-white hover:bg-slate-800 transition-colors cursor-pointer">
            <span className="mr-2">
              <FaArrowUp className="rotate-45" />
            </span>{" "}
            Create from notes
          </button>
        </div>

        {/* Error message for flashcards */}
        {errors.flashcards && (
          <p className="text-red-500 text-sm mb-4">{errors.flashcards}</p>
        )}

        {/* Flashcards with drag and drop */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="flashcards">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {flashcards.map((card, index) => (
                  <Draggable
                    key={card.id}
                    draggableId={`card-${card.id}`}
                    index={index}
                  >
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <Flashcard
                          card={card}
                          index={index}
                          onDelete={deleteFlashcard}
                          onUpdate={updateFlashcard}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Add new flashcard button */}
        <button
          onClick={addFlashcard}
          className="w-full py-3 border border-dashed border-slate-700 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors mb-8"
        >
          + Add Flashcard
        </button>

        {/* Error submission message */}
        {errors.submit && (
          <p className="text-red-500 text-center mb-4">{errors.submit}</p>
        )}

        {/* Success message */}
        {submitSuccess && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded shadow-lg">
            Flashcard set created successfully!
          </div>
        )}
      </div>
    </section>
  );
};

export default AddFlashcardPage;
