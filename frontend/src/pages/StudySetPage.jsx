import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Edit3,
  Trash2,
  Plus,
  MoreVertical,
  X,
  Save,
  FolderEdit,
  FileEdit,
} from "lucide-react";
import { toast } from "react-toastify";
import { apiRequestJson, apiRequest } from "../utils/api";

const StudySetPage = () => {
  const { studySetId } = useParams();
  const navigate = useNavigate();

  const [studySet, setStudySet] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit states
  const [showDropdown, setShowDropdown] = useState(false);
  const [editMode, setEditMode] = useState(null); // 'studyset' or 'flashcards'
  const [editingStudySet, setEditingStudySet] = useState({});
  const [editingFlashcards, setEditingFlashcards] = useState([]);
  const [saving, setSaving] = useState(false);

  // Fetch studyset and flashcards
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await apiRequestJson(`/studysets/${studySetId}`);
        console.log("API Response:", data);

        setStudySet(data.studyset);
        setFlashcards(data.flashcards || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        toast.error("Failed to load study set");
      } finally {
        setLoading(false);
      }
    };

    if (studySetId) {
      fetchData();
    }
  }, [studySetId]);

  // Navigation functions
  const goToNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const goToPrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const resetToStart = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const goToCard = (index) => {
    setCurrentCardIndex(index);
    setIsFlipped(false);
  };

  // Edit functions
  const handleEditStudySet = () => {
    setEditingStudySet({
      title: studySet.title,
      description: studySet.description || "",
    });
    setEditMode("studyset");
    setShowDropdown(false);
  };

  const handleEditFlashcards = () => {
    setEditingFlashcards([...flashcards]);
    setEditMode("flashcards");
    setShowDropdown(false);
  };

  const saveStudySet = async () => {
    try {
      setSaving(true);
      const updatedStudySet = await apiRequestJson(`/studysets/${studySetId}`, {
        method: "PUT",
        body: JSON.stringify(editingStudySet),
      });

      setStudySet(updatedStudySet);
      setEditMode(null);
      toast.success("Study set updated successfully!");
    } catch (error) {
      console.error("Error updating study set:", error);
      toast.error("Failed to update study set");
    } finally {
      setSaving(false);
    }
  };

  const saveFlashcards = async () => {
    try {
      setSaving(true);
      const result = await apiRequestJson(
        `/studysets/${studySetId}/flashcards`,
        {
          method: "PUT",
          body: JSON.stringify({
            flashcards: editingFlashcards,
          }),
        }
      );

      setFlashcards(result.flashcards || editingFlashcards);
      setEditMode(null);
      toast.success("Flashcards updated successfully!");
    } catch (error) {
      console.error("Error updating flashcards:", error);
      toast.error("Failed to update flashcards");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditMode(null);
    setEditingStudySet({});
    setEditingFlashcards([]);
  };

  const updateFlashcard = (index, field, value) => {
    const updated = [...editingFlashcards];
    updated[index] = { ...updated[index], [field]: value };
    setEditingFlashcards(updated);
  };

  const addNewFlashcard = () => {
    setEditingFlashcards([
      ...editingFlashcards,
      { question: "", answer: "", id: `temp_${Date.now()}` },
    ]);
  };

  const removeFlashcard = (index) => {
    if (editingFlashcards.length > 1) {
      const updated = editingFlashcards.filter((_, i) => i !== index);
      setEditingFlashcards(updated);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (editMode) return; // Don't handle keyboard shortcuts in edit mode

      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        if (isFlipped) {
          goToNextCard();
        } else {
          flipCard();
        }
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevCard();
      } else if (event.key === "Enter") {
        event.preventDefault();
        flipCard();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isFlipped, currentCardIndex, flashcards.length, editMode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false);
    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showDropdown]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mb-6"></div>
            <div className="h-96 bg-gray-700 rounded-lg mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <BookOpen size={64} className="mx-auto text-gray-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">
            Failed to Load Study Set
          </h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-lg transition-all duration-200"
          >
            <ArrowLeft size={20} className="inline mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!studySet || flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/home")}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold">
                  {studySet?.title || "Study Set"}
                </h1>
                <p className="text-gray-400">{studySet?.description}</p>
              </div>
            </div>
          </div>

          <div className="text-center py-16">
            <BookOpen size={64} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No Flashcards Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Add some flashcards to start studying!
            </p>
            <button
              onClick={() => toast.info("Add flashcards feature coming soon!")}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-lg transition-all duration-200"
            >
              <Plus size={20} className="inline mr-2" />
              Add Flashcards
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentCardIndex];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/home")}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              {editMode === "studyset" ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editingStudySet.title}
                    onChange={(e) =>
                      setEditingStudySet({
                        ...editingStudySet,
                        title: e.target.value,
                      })
                    }
                    className="text-3xl font-bold bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    placeholder="Study set title"
                  />
                  <textarea
                    value={editingStudySet.description}
                    onChange={(e) =>
                      setEditingStudySet({
                        ...editingStudySet,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    placeholder="Study set description (optional)"
                    rows="2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveStudySet}
                      disabled={saving || !editingStudySet.title?.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors text-sm"
                    >
                      <Save size={16} />
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-sm"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold">{studySet.title}</h1>
                  <p className="text-gray-400">{studySet.description}</p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              {currentCardIndex + 1} of {flashcards.length}
            </span>
            <button
              onClick={resetToStart}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              title="Reset to start"
            >
              <RotateCcw size={20} />
            </button>

            {/* Three Dots Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                title="More options"
              >
                <MoreVertical size={20} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10">
                  <button
                    onClick={handleEditStudySet}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-600 transition-colors duration-150 rounded-t-lg"
                  >
                    <FolderEdit size={16} className="text-cyan-400" />
                    <span className="text-gray-200">Edit Study Set</span>
                  </button>
                  <button
                    onClick={handleEditFlashcards}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-600 transition-colors duration-150 rounded-b-lg"
                  >
                    <FileEdit size={16} className="text-purple-400" />
                    <span className="text-gray-200">Edit Flashcards</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Flashcards Mode */}
        {editMode === "flashcards" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Edit Flashcards</h2>
              <div className="flex gap-2">
                <button
                  onClick={addNewFlashcard}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-sm"
                >
                  <Plus size={16} />
                  Add Card
                </button>
                <button
                  onClick={saveFlashcards}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors text-sm"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Save All"}
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-sm"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {editingFlashcards.map((card, index) => (
                <div
                  key={card.id || index}
                  className="p-6 bg-gray-800 border border-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-400">
                      Card {index + 1}
                    </span>
                    <button
                      onClick={() => removeFlashcard(index)}
                      disabled={editingFlashcards.length <= 1}
                      className="p-1 text-red-400 hover:text-red-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                      title="Delete card"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Question
                      </label>
                      <textarea
                        value={card.question}
                        onChange={(e) =>
                          updateFlashcard(index, "question", e.target.value)
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        rows="3"
                        placeholder="Enter the question..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Answer
                      </label>
                      <textarea
                        value={card.answer}
                        onChange={(e) =>
                          updateFlashcard(index, "answer", e.target.value)
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        rows="3"
                        placeholder="Enter the answer..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Flashcard Carousel */}
            <div className="mb-12">
              <div className="relative max-w-4xl mx-auto">
                <div className="relative h-96 mb-8">
                  <div
                    className={`flashcard-container ${
                      isFlipped ? "flipped" : ""
                    }`}
                    onClick={flipCard}
                  >
                    <div className="flashcard-face flashcard-front">
                      <div className="absolute top-4 left-4">
                        <span className="text-xs uppercase tracking-wide text-gray-400 bg-gray-700 px-2 py-1 rounded">
                          Question
                        </span>
                      </div>
                      <div className="flex items-center justify-center h-full p-8">
                        <p className="text-xl md:text-2xl text-center leading-relaxed">
                          {currentCard.question}
                        </p>
                      </div>
                      <div className="absolute bottom-4 right-4 text-gray-400">
                        <span className="text-sm">Click to reveal answer</span>
                      </div>
                    </div>

                    <div className="flashcard-face flashcard-back">
                      <div className="absolute top-4 left-4">
                        <span className="text-xs uppercase tracking-wide text-gray-400 bg-green-700 px-2 py-1 rounded">
                          Answer
                        </span>
                      </div>
                      <div className="flex items-center justify-center h-full p-8">
                        <p className="text-xl md:text-2xl text-center leading-relaxed text-green-100">
                          {currentCard.answer}
                        </p>
                      </div>
                      <div className="absolute bottom-4 right-4 text-gray-400">
                        <span className="text-sm">Click to see question</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={goToPrevCard}
                    disabled={currentCardIndex === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      currentCardIndex === 0
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={flipCard}
                      className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-lg transition-all duration-200"
                    >
                      {isFlipped ? "Show Question" : "Show Answer"}
                    </button>
                  </div>

                  <button
                    onClick={goToNextCard}
                    disabled={currentCardIndex === flashcards.length - 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      currentCardIndex === flashcards.length - 1
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>
                      {Math.round(
                        ((currentCardIndex + 1) / flashcards.length) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          ((currentCardIndex + 1) / flashcards.length) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Keyboard Shortcuts */}
                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>
                    Use{" "}
                    <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">
                      ←
                    </kbd>{" "}
                    and{" "}
                    <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">
                      →
                    </kbd>{" "}
                    to navigate,{" "}
                    <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">
                      Space
                    </kbd>{" "}
                    or{" "}
                    <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">
                      Enter
                    </kbd>{" "}
                    to flip
                  </p>
                </div>
              </div>
            </div>

            {/* All Flashcards List */}
            <div className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-semibold mb-6">All Flashcards</h2>
              <div className="space-y-4">
                {flashcards.map((card, index) => (
                  <div
                    key={card.id}
                    onClick={() => goToCard(index)}
                    className={`p-6 rounded-lg border transition-all duration-200 cursor-pointer ${
                      index === currentCardIndex
                        ? "border-cyan-500 bg-gray-800 shadow-lg shadow-cyan-500/10"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-750"
                    }`}
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs uppercase tracking-wide text-gray-400 bg-gray-700 px-2 py-1 rounded">
                            Question {index + 1}
                          </span>
                          {index === currentCardIndex && (
                            <span className="text-xs bg-cyan-500 text-white px-2 py-1 rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-gray-200 leading-relaxed">
                          {card.question}
                        </p>
                      </div>
                      <div>
                        <div className="mb-2">
                          <span className="text-xs uppercase tracking-wide text-gray-400 bg-green-700 px-2 py-1 rounded">
                            Answer
                          </span>
                        </div>
                        <p className="text-green-100 leading-relaxed">
                          {card.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudySetPage;
