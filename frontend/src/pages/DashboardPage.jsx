import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  MoreVertical,
  Edit3,
  Trash2,
  BookOpen,
  Calendar,
  Users,
} from "lucide-react";
import { toast } from "react-toastify";
import { apiRequestJson, apiRequest } from "../utils/api";

const DashboardPage = () => {
  const [studySets, setStudySets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  // Fetch study sets from backend
  useEffect(() => {
    const fetchStudySets = async () => {
      try {
        const data = await apiRequestJson("/studysets/");
        setStudySets(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching study sets:", error);
        toast.error("Failed to load study sets");
        setLoading(false);
      }
    };

    fetchStudySets();
  }, []);

  const handleCreateStudySet = () => {
    navigate("/home/studysets/create");
  };

  const handleStudySetClick = (studySetId) => {
    navigate(`/home/studysets/${studySetId}`);
  };

  const handleEditStudySet = (studySetId, e) => {
    e.stopPropagation();
    setActiveDropdown(null);
    navigate(`/home/studysets/${studySetId}/edit`);
  };

  const handleDeleteStudySet = async (studySetId, e) => {
    e.stopPropagation();
    setActiveDropdown(null);

    if (window.confirm("Are you sure you want to delete this study set?")) {
      try {
        await apiRequest(`/studysets/${studySetId}`, {
          method: "DELETE",
        });

        // Remove from local state
        setStudySets(studySets.filter((set) => set.id !== studySetId));
        toast.success("Study set deleted successfully");
      } catch (error) {
        console.error("Error deleting study set:", error);
        toast.error("Failed to delete study set");
      }
    }
  };

  const toggleDropdown = (studySetId, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === studySetId ? null : studySetId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCardCount = (studySet) => {
    // If your backend returns flashcard count, use it
    // Otherwise, you might need to make a separate call or include it in the studyset response
    return studySet.flashcard_count || studySet.card_count || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-700 rounded w-48 mb-8"></div>
            <div className="h-8 bg-gray-700 rounded w-32 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Dashboard
        </h1>

        {/* StudySets Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-100">StudySets</h2>
            <button
              onClick={handleCreateStudySet}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-lg transition-all duration-200 font-medium cursor-pointer"
            >
              <Plus size={20} />
              Create StudySet
            </button>
          </div>

          {/* StudySets Grid */}
          {studySets.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={64} className="mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No StudySets Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first study set to get started!
              </p>
              <button
                onClick={handleCreateStudySet}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-lg transition-all duration-200 font-medium"
              >
                <Plus size={20} className="inline mr-2" />
                Create Your First StudySet
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studySets.map((studySet) => (
                <div
                  key={studySet.id}
                  onClick={() => handleStudySetClick(studySet.id)}
                  className="group relative bg-gray-800 border border-gray-700 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:bg-gray-750 hover:border-gray-600 hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  {/* Three Dots Menu */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => toggleDropdown(studySet.id, e)}
                      className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                    >
                      <MoreVertical size={16} className="text-gray-400" />
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === studySet.id && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10">
                        <button
                          onClick={(e) => handleEditStudySet(studySet.id, e)}
                          className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-600 transition-colors duration-150 rounded-t-lg cursor-pointer"
                        >
                          <Edit3 size={16} className="text-cyan-400" />
                          <span className="text-gray-200">Edit StudySet</span>
                        </button>
                        <button
                          onClick={(e) => handleDeleteStudySet(studySet.id, e)}
                          className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-600 transition-colors duration-150 rounded-b-lg cursor-pointer"
                        >
                          <Trash2 size={16} className="text-red-400" />
                          <span className="text-gray-200">Delete StudySet</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-white mb-2 pr-8">
                      {studySet.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {studySet.description || "No description provided"}
                    </p>
                  </div>

                  {/* Card Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{getCardCount(studySet)} cards</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>
                        {formatDate(studySet.updated_at || studySet.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Hover Effect Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
