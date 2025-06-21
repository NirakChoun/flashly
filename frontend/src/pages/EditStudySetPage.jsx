import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, BookOpen, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { apiRequestJson, apiRequest } from "../utils/FetchApi";

const EditStudySetPage = () => {
  const { studySetId } = useParams();
  const navigate = useNavigate();

  const [studySet, setStudySet] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch study set data
  useEffect(() => {
    const fetchStudySet = async () => {
      try {
        setIsLoading(true);
        const data = await apiRequestJson(`/studysets/${studySetId}`);
        const studySetData = data.studyset;

        setStudySet(studySetData);
        setFormData({
          title: studySetData.title || "",
          description: studySetData.description || "",
        });
      } catch (error) {
        console.error("Error fetching study set:", error);
        toast.error("Failed to load study set");
        navigate("/home");
      } finally {
        setIsLoading(false);
      }
    };

    if (studySetId) {
      fetchStudySet();
    }
  }, [studySetId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const updatedStudySet = await apiRequestJson(`/studysets/${studySetId}`, {
        method: "PUT",
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
        }),
      });

      setStudySet(updatedStudySet);
      toast.success("Study set updated successfully!");
      navigate(`/home/studysets/${studySetId}`);
    } catch (error) {
      console.error("Error updating study set:", error);
      toast.error(error.message || "Failed to update study set");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this study set? This action cannot be undone and will delete all associated flashcards."
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      await apiRequest(`/studysets/${studySetId}`, {
        method: "DELETE",
      });

      toast.success("Study set deleted successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error deleting study set:", error);
      toast.error(error.message || "Failed to delete study set");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (
      JSON.stringify(formData) !==
      JSON.stringify({
        title: studySet?.title || "",
        description: studySet?.description || "",
      })
    ) {
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
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mb-8"></div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
              <div className="space-y-6">
                <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
                <div className="h-12 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-32 bg-gray-700 rounded"></div>
              </div>
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
      <div className="max-w-4xl mx-auto">
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
              Edit Study Set
            </h1>
            <p className="text-gray-400 mt-1">
              Make changes to your study set details
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Title Field */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                  errors.title ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="Enter study set title"
                maxLength={200}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">{errors.title}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.title.length}/200 characters
              </p>
            </div>

            {/* Description Field */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Description <span className="text-gray-500">(optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-vertical ${
                  errors.description ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="Add a description for your study set..."
                maxLength={1000}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.description}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/1000 characters
              </p>
            </div>

            {/* Study Set Info */}
            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-2">
                Study Set Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Created:</span>
                  <span className="text-gray-200 ml-2">
                    {new Date(studySet.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Last Updated:</span>
                  <span className="text-gray-200 ml-2">
                    {new Date(studySet.updated_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-700">
              {/* Delete Button */}
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors text-sm"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Study Set
                  </>
                )}
              </button>

              {/* Save/Cancel Buttons */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  disabled={isSaving || isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isDeleting || !formData.title.trim()}
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

        {/* Quick Actions */}
        <div className="mt-6 bg-cyan-900/20 border border-cyan-700/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <BookOpen
              size={20}
              className="text-cyan-400 mt-0.5 flex-shrink-0"
            />
            <div>
              <h3 className="text-sm font-medium text-cyan-300 mb-1">
                Quick Actions
              </h3>
              <p className="text-sm text-cyan-100/80 mb-3">
                Need to make changes to your flashcards too?
              </p>
              <button
                onClick={() =>
                  navigate(`/home/studysets/${studySetId}/edit-flashcards`)
                }
                className="text-sm text-cyan-300 hover:text-cyan-200 underline"
              >
                Edit Flashcards →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStudySetPage;
