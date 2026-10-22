import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import RecipeCard from "./RecipieCard";
import toast from "react-hot-toast";

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await api.get("/api/recipes/saved");
        setRecipes(response.data);
      } catch (err) {
        console.error("Failed to fetch saved recipes:", err);

        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Please log in to view your saved recipes.");
        } else {
          setError("Failed to load saved recipes. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSavedRecipes();
  }, []);

  const handleViewRecipe = (recipe) => {
    navigate(`/recipe-details/${recipe.id}`);
  };


    const handleUnsaveRecipe = async (id) => {
        try {
            const response = await api.patch(`/api/recipes/${id}/save`);
            const isSaved = response.data;

            if (!isSaved) {
                setRecipes((prevRecipes) =>
                    prevRecipes.filter((recipe) => recipe.id !== id)
                );

                toast.success("Recipe removed from saved recipes.");
            }
        } catch (err) {
            console.error("Failed to remove saved recipe:", err);

            if (err.response?.status === 401 || err.response?.status === 403) {
                toast.error("Your session may have expired. Please log in again.");
            } else {
                toast.error("Failed to remove saved recipe. Please try again.");
            }
        }
    };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading your saved recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Saved Recipes
      </h1>

      <p className="text-gray-600 mb-8">
        Your favourite recipes, all in one place.
      </p>

      {recipes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No saved recipes yet
          </h2>

          <p className="text-gray-600">
            Save recipes you love, and they'll appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onViewRecipe={() => handleViewRecipe(recipe)}
              onSave={handleUnsaveRecipe}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;