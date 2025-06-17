import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  X,
  Loader,
} from "lucide-react";
import { toast } from "react-toastify";

const GeneratePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState({});

  // Supported file types
  const supportedTypes = [
    "application/pdf",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB

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

  const validateFile = (file) => {
    if (!file) return "Please select a file";

    if (!supportedTypes.includes(file.type)) {
      return "Unsupported file type. Please upload PDF, TXT, or DOC files.";
    }

    if (file.size > maxFileSize) {
      return "File size must be less than 10MB";
    }

    return null;
  };

  const handleFileSelect = (file) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setSelectedFile(file);
    setErrors((prev) => ({ ...prev, file: "" }));
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Study set title is required";
    } else if (formData.title.trim().length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    if (!selectedFile) {
      newErrors.file = "Please select a file to generate flashcards from";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsGenerating(true);

    try {
      // Step 1: Create the study set
      const studySetResponse = await fetch("/api/studysets/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
        }),
      });

      if (!studySetResponse.ok) {
        const errorData = await studySetResponse.json();
        throw new Error(errorData.error || "Failed to create study set");
      }

      const studySet = await studySetResponse.json();

      // Step 2: Generate flashcards preview from file
      const generateFormData = new FormData();
      generateFormData.append("file", selectedFile);

      const previewResponse = await fetch(
        `/api/studysets/${studySet.id}/flashcards/preview`,
        {
          method: "POST",
          credentials: "include",
          body: generateFormData,
        }
      );

      if (!previewResponse.ok) {
        const errorData = await previewResponse.json();
        throw new Error(errorData.error || "Failed to generate flashcards");
      }

      const previewData = await previewResponse.json();

      toast.success(
        `Generated ${previewData.flashcards.length} flashcards from your file!`
      );

      // Navigate to preview page with the data
      navigate(`/home/studysets/${studySet.id}/preview`, {
        state: {
          studySet,
          previewData,
          sourceFileName: selectedFile.name,
        },
      });
    } catch (error) {
      console.error("Error generating flashcards:", error);
      toast.error(error.message || "Failed to generate flashcards");
    } finally {
      setIsGenerating(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/home")}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent flex items-center justify-center gap-3">
              <Sparkles size={28} className="sm:size-8 flex-shrink-0" />
              Generate Flashcards
            </h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              Upload a document and let AI create flashcards for you
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleGenerate} className="space-y-8">
          {/* Study Set Details */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">
              Study Set Details
            </h2>

            <div className="space-y-4">
              {/* Title */}
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
                  placeholder="Enter study set title (e.g., 'History Chapter 5', 'Biology Terms')"
                  maxLength={200}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-400">{errors.title}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.title.length}/200 characters
                </p>
              </div>

              {/* Description */}
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
                  rows={3}
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-vertical ${
                    errors.description ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="Describe what this study set covers..."
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
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">
              Upload Document
            </h2>

            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                dragActive
                  ? "border-cyan-500 bg-cyan-900/10"
                  : errors.file
                  ? "border-red-500 bg-red-900/10"
                  : "border-gray-600 hover:border-gray-500"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                accept=".pdf,.txt,.doc,.docx"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {selectedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <CheckCircle size={48} className="text-green-400" />
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText size={24} className="text-cyan-400" />
                        <div>
                          <p className="font-medium text-gray-200">
                            {selectedFile.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {formatFileSize(selectedFile.size)} •{" "}
                            {selectedFile.type.split("/")[1].toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <Upload
                      size={48}
                      className={dragActive ? "text-cyan-400" : "text-gray-400"}
                    />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-300 mb-2">
                      {dragActive
                        ? "Drop your file here"
                        : "Upload your document"}
                    </p>
                    <p className="text-gray-500 mb-4">
                      Drag and drop or click to browse
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-colors"
                    >
                      Choose File
                    </button>
                  </div>
                </div>
              )}
            </div>

            {errors.file && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle size={16} />
                {errors.file}
              </p>
            )}

            {/* File Info */}
            <div className="mt-4 text-sm text-gray-500">
              <p className="font-medium mb-2">Supported formats:</p>
              <div className="flex flex-wrap gap-2">
                {["PDF", "TXT", "DOC", "DOCX"].map((format) => (
                  <span
                    key={format}
                    className="px-2 py-1 bg-gray-700 rounded text-xs"
                  >
                    {format}
                  </span>
                ))}
              </div>
              <p className="mt-2">Maximum file size: 10MB</p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-700/50 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Sparkles
                size={24}
                className="text-cyan-400 mt-0.5 flex-shrink-0"
              />
              <div>
                <h3 className="text-lg font-medium text-cyan-300 mb-2">
                  How AI Generation Works
                </h3>
                <ul className="text-sm text-cyan-100/80 space-y-1">
                  <li>• Upload your study material (PDF, DOC, or TXT)</li>
                  <li>• AI analyzes the content and extracts key concepts</li>
                  <li>• Generates relevant questions and answers</li>
                  <li>• Review and edit before saving to your collection</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              disabled={isGenerating}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isGenerating || !formData.title.trim() || !selectedFile}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg transition-all font-medium"
            >
              {isGenerating ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Flashcards
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneratePage;
