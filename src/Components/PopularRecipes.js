import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "./RecipieCard";
import api from "../api/axios";
import toast from "react-hot-toast";

const PopularRecipes = () => {
  const navigate = useNavigate();

  const [popularRecipes, setPopularRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    api
      .get("/api/recipes/popular", {
        params: {
          page: currentPage,
          size: 12,
        },
      })
      .then((res) => {
        setPopularRecipes(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      })
      .catch((err) => {
        console.error("Failed to fetch popular recipes:", err);
        toast.error("Failed to load popular recipes.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage]);

  const handleLike = (id) => {
    api
      .patch(`/api/recipes/${id}/like`)
      .then((res) => {
        const updatedRecipe = res.data;

        setPopularRecipes((recipes) =>
          recipes.map((recipe) =>
            recipe.id === updatedRecipe.id ? updatedRecipe : recipe
          )
        );
      })
      .catch((err) => {
        console.error("Failed to like recipe:", err);

        if (err.response?.status === 401 || err.response?.status === 403) {
          toast.error("Your session may have expired. Please log in again.");
        } else {
          toast.error("Failed to like recipe. Please try again.");
        }
      });
  };

  const handleSaveRecipe = (id) => {
    api
      .patch(`/api/recipes/${id}/save`)
      .then((res) => {
        if (res.data) {
          toast.success("Recipe saved successfully!");
        } else {
          toast("Recipe removed from saved recipes.");
        }
      })
      .catch((err) => {
        console.error("Failed to save recipe:", err);

        if (err.response?.status === 401 || err.response?.status === 403) {
          toast.error("Your session may have expired. Please log in again.");
        } else {
          toast.error("Failed to update saved recipe. Please try again.");
        }
      });
  };

  const handleViewRecipe = (recipe) => {
    navigate(`/recipe-details/${recipe.id}`);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <section className="mt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-orange-500 inline-block pb-1">
          Popular Recipes
        </h1>

        {loading ? (
          <p className="text-gray-500">Loading popular recipes...</p>
        ) : popularRecipes.length === 0 ? (
          <p className="text-gray-500">No popular recipes available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {popularRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onViewRecipe={() => handleViewRecipe(recipe)}
                onLike={() => handleLike(recipe.id)}
                onSave={handleSaveRecipe}
                showDelete={false}
              />
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage((page) => page - 1)}
              disabled={currentPage === 0}
              className="px-4 py-2 rounded-lg bg-orange-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <span className="text-gray-700">
              Page {currentPage + 1} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((page) => page + 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-4 py-2 rounded-lg bg-orange-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default PopularRecipes;
