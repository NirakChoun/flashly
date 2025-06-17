import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Edit3,
  FileText,
  Sparkles,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify";

const PreviewGeneratedStudySetPage = () => {
  const { studySetId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [studySet, setStudySet] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [originalFlashcards, setOriginalFlashcards] = useState([]);
  const [sourceFileName, setSourceFileName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize data from navigation state or fetch from API
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);

        if (location.state) {
          // Data passed from GeneratePage
          const {
            studySet: navStudySet,
            previewData,
            sourceFileName: navSourceFileName,
          } = location.state;
          setStudySet(navStudySet);
          setFlashcards(previewData.flashcards || []);
          setOriginalFlashcards(previewData.flashcards || []);
          setSourceFileName(navSourceFileName || "");
        } else {
          // Fallback: fetch from API (if user refreshes page)
          const response = await fetch(`/api/studysets/${studySetId}`, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch study set");
          }

          const data = await response.json();
          setStudySet(data.studyset);
          setFlashcards(data.flashcards || []);
          setOriginalFlashcards(data.flashcards || []);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load preview data");
        navigate("/home");
      } finally {
        setIsLoading(false);
      }
    };

    if (studySetId) {
      initializeData();
    }
  }, [studySetId, location.state, navigate]);

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
        id: `temp_${Date.now()}`,
        question: "",
        answer: "",
        isNew: true,
      },
    ]);
  };

  const removeFlashcard = (index) => {
    if (flashcards.length > 1) {
      const updatedFlashcards = flashcards.filter((_, i) => i !== index);
      setFlashcards(updatedFlashcards);

      // Remove errors for this flashcard
      const newErrors = { ...errors };
      delete newErrors[`${index}_question`];
      delete newErrors[`${index}_answer`];
      setErrors(newErrors);
    } else {
      toast.error("You must have at least one flashcard");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    flashcards.forEach((card, index) => {
      if (!card.question?.trim()) {
        newErrors[`${index}_question`] = "Question is required";
      }
      if (!card.answer?.trim()) {
        newErrors[`${index}_answer`] = "Answer is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all questions and answers");
      return;
    }

    setIsSaving(true);

    try {
      // Prepare flashcards data for saving
      const flashcardsToSave = flashcards.map((card) => ({
        question: card.question.trim(),
        answer: card.answer.trim(),
      }));

      const response = await fetch(
        `/api/studysets/${studySetId}/flashcards/save-preview`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            flashcards: flashcardsToSave,
            source_file_name: sourceFileName,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save flashcards");
      }

      const result = await response.json();
      toast.success(
        `Successfully saved ${result.flashcards.length} flashcards!`
      );

      // Navigate to the study set page
      navigate(`/home/studysets/${studySetId}`);
    } catch (error) {
      console.error("Error saving flashcards:", error);
      toast.error(error.message || "Failed to save flashcards");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? All generated flashcards will be lost and the study set will be deleted."
      )
    ) {
      // Delete the empty study set since user is canceling
      fetch(`/api/studysets/${studySetId}`, {
        method: "DELETE",
        credentials: "include",
      })
        .then(() => {
          navigate("/home");
        })
        .catch((error) => {
          console.error("Error deleting study set:", error);
          navigate("/home");
        });
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
          <AlertTriangle size={64} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Preview Not Available</h2>
          <p className="text-gray-400 mb-6">Unable to load the preview data.</p>
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
              <Sparkles className="inline mr-3" size={32} />
              Preview Generated Flashcards
            </h1>
            <p className="text-gray-400 mt-1">
              Review and edit your AI-generated flashcards for "{studySet.title}
              "
            </p>
          </div>
        </div>

        {/* Source File Info */}
        {sourceFileName && (
          <div className="bg-gradient-to-r from-green-900/20 to-cyan-900/20 border border-green-700/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-green-400" />
                <FileText size={20} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-300">
                  Generated from: {sourceFileName}
                </p>
                <p className="text-xs text-green-100/80">
                  {flashcards.length} flashcards created • Review and edit as
                  needed
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Flashcards Preview */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Generated Flashcards</h2>
            <button
              onClick={addFlashcard}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-sm"
            >
              <Plus size={16} />
              Add Card
            </button>
          </div>

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
                      Added
                    </span>
                  )}
                  {!card.isNew &&
                    !originalFlashcards.find(
                      (orig) =>
                        orig.question === card.question &&
                        orig.answer === card.answer
                    ) && (
                      <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">
                        Modified
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
                    value={card.question || ""}
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
                    value={card.answer || ""}
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

        {/* Info Box */}
        <div className="bg-cyan-900/20 border border-cyan-700/50 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <Edit3 size={20} className="text-cyan-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-cyan-300 mb-1">
                Preview Tips
              </h3>
              <ul className="text-sm text-cyan-100/80 space-y-1">
                <li>• Review each flashcard for accuracy and clarity</li>
                <li>• Edit questions and answers to better match your needs</li>
                <li>• Add more flashcards if needed or remove unwanted ones</li>
                <li>• Save when you're satisfied with the content</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-700">
          <div className="text-sm text-gray-400">
            {flashcards.length} flashcard{flashcards.length !== 1 ? "s" : ""}{" "}
            ready to save
            {hasChanges() && (
              <span className="text-yellow-400 ml-2">• Changes made</span>
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
              onClick={handleSave}
              disabled={isSaving || flashcards.length === 0}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg transition-all font-medium"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Flashcards
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewGeneratedStudySetPage;
