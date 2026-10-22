import React, { useEffect, useState } from "react";
import api from "../api/axios";
import RecipeCard from "./RecipieCard";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const response = await api.get("/api/recipes/my-recipes");
        setRecipes(response.data);
      } catch (err) {
        console.error("Failed to fetch my recipes:", err);

        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Please log in to view your recipes.");
        } else {
          setError("Failed to load your recipes. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecipes();
  }, []);

  const handleViewRecipe = (recipe) => {
    navigate(`/recipe-details/${recipe.id}`);
  };

    const handleDeleteRecipe = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this recipe?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/api/recipes/${id}`);

            setRecipes((prevRecipes) =>
                prevRecipes.filter((recipe) => recipe.id !== id)
            );

            toast.success("Recipe deleted successfully!");
        } catch (err) {
            console.error("Failed to delete recipe:", err);

            if (err.response?.status === 401 || err.response?.status === 403) {
                toast.error("You are not authorized to delete this recipe. Please log in again if your session has expired.");
            } else {
                toast.error("Failed to delete recipe. Please try again.");
            }
        }
    };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading your recipes...</p>
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
        My Recipes
      </h1>

      <p className="text-gray-600 mb-8">
        Manage the recipes you've shared with the community.
      </p>

      {recipes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No recipes yet
          </h2>
          <p className="text-gray-600">
            You haven't uploaded any recipes yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onViewRecipe={() => handleViewRecipe(recipe)}
              onDelete={() => handleDeleteRecipe(recipe.id)}
              showDelete={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecipes;