import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RecipeDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const recipe = location.state?.recipe; 

  if (!recipe) {
    return (
      <div className="text-center mt-20">
        <p>Recipe not found!</p>
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
      <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
      <img
        src={recipe.imageFile || "/images/default.jpg"}
        alt={recipe.title}
        className="w-full h-96 object-cover rounded-lg mb-6"
      />
      <p className="mb-4">{recipe.description}</p>

      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <>
          <h3 className="font-semibold mb-2">Ingredients</h3>
          <ul className="list-disc list-inside mb-4">
            {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
          </ul>
        </>
      )}

      <p className="font-semibold">Category: {recipe.category}</p>
      <p className="font-semibold">Likes: {recipe.likes || 0}</p>
      <p className="font-semibold mt-3">Comments:</p>
      <ul className="list-disc list-inside">
        {recipe.comments && recipe.comments.length > 0
          ? recipe.comments.map((c, i) => <li key={i}>{c}</li>)
          : "No comments yet."}
      </ul>
    </div>
  );
};

export default RecipeDetails;
