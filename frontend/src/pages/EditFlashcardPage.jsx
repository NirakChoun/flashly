import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2, BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import { apiRequestJson } from "../utils/api";

const EditFlashcardPage = () => {
  const { studySetId } = useParams();
  const navigate = useNavigate();

  const [studySet, setStudySet] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [originalFlashcards, setOriginalFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch study set and flashcards
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await apiRequestJson(`/studysets/${studySetId}`);
        setStudySet(data.studyset);
        setFlashcards(data.flashcards || []);
        setOriginalFlashcards(data.flashcards || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load study set and flashcards");
        navigate("/home");
      } finally {
        setIsLoading(false);
      }
    };

    if (studySetId) {
      fetchData();
    }
  }, [studySetId, navigate]);

  const handleFlashcardChange = (index, field, value) => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[index] = {
      ...updatedFlashcards[index],
      [field]: value,
    };
    setFlashcards(updatedFlashcards);

    // Clear error when user starts typing
    const errorKey = `${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "",
      }));
    }
  };

  const addFlashcard = () => {
    setFlashcards([
      ...flashcards,
      {
        id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // More unique temp ID
        question: "",
        answer: "",
        isNew: true,
      },
    ]);
  };

  const removeFlashcard = (index) => {
    if (flashcards.length > 1) {
      const cardToRemove = flashcards[index];
      const updatedFlashcards = flashcards.filter((_, i) => i !== index);
      setFlashcards(updatedFlashcards);

      // Remove errors for this flashcard
      const newErrors = { ...errors };
      delete newErrors[`${index}_question`];
      delete newErrors[`${index}_answer`];
      setErrors(newErrors);

      // If it's an existing card, we'll handle deletion in the API call
      if (cardToRemove.id && !cardToRemove.isNew) {
        toast.info("Flashcard will be deleted when you save changes");
      }
    } else {
      toast.error("You must have at least one flashcard");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    flashcards.forEach((card, index) => {
      if (!card.question.trim()) {
        newErrors[`${index}_question`] = "Question is required";
      }
      if (!card.answer.trim()) {
        newErrors[`${index}_answer`] = "Answer is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all questions and answers");
      return;
    }

    setIsSaving(true);

    try {
      const existingFlashcards = flashcards.filter(
        (card) => card.id && !card.isNew && !card.id.startsWith("temp_")
      );
      const newFlashcards = flashcards.filter(
        (card) => card.isNew || card.id.startsWith("temp_")
      );

      const originalIds = originalFlashcards.map((card) => card.id);
      const currentIds = existingFlashcards.map((card) => card.id);
      const deletedIds = originalIds.filter((id) => !currentIds.includes(id));

      const updateData = {
        flashcards: [
          ...existingFlashcards.map((card) => ({
            id: card.id,
            question: card.question.trim(),
            answer: card.answer.trim(),
          })),
          ...newFlashcards.map((card) => ({
            question: card.question.trim(),
            answer: card.answer.trim(),
          })),
        ],
        delete_ids: deletedIds,
      };

      const result = await apiRequestJson(
        `/studysets/${studySetId}/flashcards`,
        {
          method: "PUT",
          body: JSON.stringify(updateData),
        }
      );

      toast.success(`Successfully updated flashcards!`);
      navigate(`/home/studysets/${studySetId}`);
    } catch (error) {
      console.error("Error updating flashcards:", error);
      toast.error(error.message || "Failed to update flashcards");
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = () => {
    if (flashcards.length !== originalFlashcards.length) return true;

    return flashcards.some((card, index) => {
      const original = originalFlashcards[index];
      if (!original) return true;
      return (
        card.question !== original.question || card.answer !== original.answer
      );
    });
  };

  const handleCancel = () => {
    if (hasChanges()) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        )
      ) {
        navigate(`/home/studysets/${studySetId}`);
      }
    } else {
      navigate(`/home/studysets/${studySetId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mb-8"></div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!studySet) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <BookOpen size={64} className="mx-auto text-gray-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Study Set Not Found</h2>
          <p className="text-gray-400 mb-6">
            The study set you're looking for doesn't exist.
          </p>
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleCancel}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Edit Flashcards
            </h1>
            <p className="text-gray-400 mt-1">
              Editing flashcards for "{studySet.title}"
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Flashcards */}
          <div className="space-y-6">
            {flashcards.map((card, index) => (
              <div
                key={card.id || index}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 relative"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-200">
                      Flashcard {index + 1}
                    </h3>
                    {card.isNew && (
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                        New
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFlashcard(index)}
                    disabled={flashcards.length <= 1}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    title="Delete flashcard"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Card Content */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Question */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Question <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={card.question}
                      onChange={(e) =>
                        handleFlashcardChange(index, "question", e.target.value)
                      }
                      className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-vertical ${
                        errors[`${index}_question`]
                          ? "border-red-500"
                          : "border-gray-600"
                      }`}
                      placeholder="Enter your question here..."
                      rows={4}
                    />
                    {errors[`${index}_question`] && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors[`${index}_question`]}
                      </p>
                    )}
                  </div>

                  {/* Answer */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Answer <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={card.answer}
                      onChange={(e) =>
                        handleFlashcardChange(index, "answer", e.target.value)
                      }
                      className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-vertical ${
                        errors[`${index}_answer`]
                          ? "border-red-500"
                          : "border-gray-600"
                      }`}
                      placeholder="Enter the answer here..."
                      rows={4}
                    />
                    {errors[`${index}_answer`] && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors[`${index}_answer`]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Flashcard Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={addFlashcard}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-dashed border-gray-600 text-gray-400 rounded-lg hover:border-gray-500 hover:text-gray-300 transition-colors"
            >
              <Plus size={20} />
              Add Another Flashcard
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-cyan-900/20 border border-cyan-700/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <BookOpen
                size={20}
                className="text-cyan-400 mt-0.5 flex-shrink-0"
              />
              <div>
                <h3 className="text-sm font-medium text-cyan-300 mb-1">
                  Editing Tips
                </h3>
                <ul className="text-sm text-cyan-100/80 space-y-1">
                  <li>
                    • Changes are saved only when you click "Save Changes"
                  </li>
                  <li>• Deleted flashcards cannot be recovered</li>
                  <li>• You must have at least one flashcard</li>
                  <li>• New flashcards are marked with a "New" badge</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              {flashcards.length} flashcard{flashcards.length !== 1 ? "s" : ""}
              {hasChanges() && (
                <span className="text-yellow-400 ml-2">• Unsaved changes</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || flashcards.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg transition-all font-medium"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFlashcardPage;
