import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { getToken } from "../utils/authStorage";
import { HiOutlineBookmark } from "react-icons/hi";

const RecipeDetails = () => {

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();


  const handleLike = async () => {
    if (!getToken()) {
      alert("Please log in to like recipes.");
      return;
    }

    try {
      const response = await api.patch(`/api/recipes/${id}/like`);
      setRecipe(response.data);
    } catch (err) {
      console.error("Failed to like recipe:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Your session may have expired. Please log in again.");
      } else {
        alert("Failed to like recipe. Please try again.");
      }
    }
  };


  const handleSave = async () => {
    if (!getToken()) {
      alert("Please log in to save recipes.");
      return;
    }

    try {
      const response = await api.patch(`/api/recipes/${id}/save`);
      const isSaved = response.data;

      alert(
        isSaved
          ? "Recipe saved successfully!"
          : "Recipe removed from saved recipes."
      );
    } catch (err) {
      console.error("Failed to save recipe:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Your session may have expired. Please log in again.");
      } else {
        alert("Failed to update saved recipe. Please try again.");
      }
    }
  };


  useEffect(() => {
    api.get(`/api/recipes/${id}`)
      .then((res) => {
        setRecipe(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Recipe not found");
        setLoading(false);
      });
  }, [id]);


  if (loading) {
    return <p className="text-center mt-20">Loading recipe...</p>;
  }

  if (error) {
    return (
      <div className="text-center mt-20">
        <p>{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-orange-100 text-orange-600 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }



  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Recipe Title */}
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        {recipe.title}
      </h1>

      {/* Recipe Image with Category Badge */}
      <div className="relative mb-6">
        <img
          src={recipe.imageBase64 || "/default-recipe.jpg"}
          alt={recipe.title}
          className="w-full h-96 object-cover rounded-xl"
        />

        <span
          className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full text-white ${(recipe.category || "").toLowerCase() === "spicy"
            ? "bg-red-500"
            : "bg-amber-700"
            }`}
        >
          {recipe.category}
        </span>
      </div>

      {/* Like and Save Buttons */}
      <div className="flex items-center justify-between gap-3 sm:gap-4 mb-8">
        <button
          onClick={handleLike}
          className="inline-flex items-center justify-center gap-2 flex-1 sm:flex-none min-w-0 sm:min-w-32 px-3 sm:px-5 py-3 bg-orange-100 text-orange-600 font-semibold rounded-xl border border-orange-200 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 active:scale-95"
        >
          👍 <span>{recipe.likes || 0} Likes</span>
        </button>

        <button
          onClick={handleSave}
          aria-label="Save recipe"
          title="Save recipe"
          className="inline-flex items-center justify-center gap-2 flex-1 sm:flex-none min-w-0 sm:min-w-32 px-3 sm:px-5 py-3 bg-orange-100 text-orange-600 font-semibold rounded-xl border border-orange-200 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 active:scale-95"
        >
          <HiOutlineBookmark className="w-5 h-5 shrink-0" />
          <span>Save Recipe</span>
        </button>
      </div>

      {/* Ingredients */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ingredients
          </h2>

          <ul className="space-y-3">
            {recipe.ingredients.map((ing, i) => (
              <li
                key={i}
                className="flex items-center gap-3 py-2"
              >
                <input
                  type="checkbox"
                  id={`ingredient-${i}`}
                  className="w-5 h-5 shrink-0 accent-orange-500 cursor-pointer rounded focus:ring-2 focus:ring-orange-300"
                />

                <label
                  htmlFor={`ingredient-${i}`}
                  className="flex-1 text-gray-700 cursor-pointer"
                >
                  {ing}
                </label>
              </li>
            ))}
          </ul>
        </section>
      )}


      {/* Recipe Description */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          How to make it :
        </h2>

        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
          {recipe.description || "No description available for this recipe."}
        </p>
      </div>
    </div>
  );
};

export default RecipeDetails;
