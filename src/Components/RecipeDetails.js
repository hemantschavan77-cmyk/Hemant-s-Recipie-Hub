import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

const RecipeDetails = () => {

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();


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
      <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
      <img    
        src={recipe.imageBase64 || 'default-recipe.jpg'}
        alt={recipe.title}
        className="w-full h-96 object-cover rounded-lg mb-6"
      />
      <p className="mb-4">{recipe.description}</p>

      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <>
          <h3 className="font-semibold mb-2">Ingredients</h3>
          <ul className="mb-4 space-y-2">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-center">
                <input
                  type="checkbox"
                  id={`ingredient-${i}`}
                  className="w-4 h-4 mr-3 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor={`ingredient-${i}`} className="text-gray-700">
                  {ing}
                </label>
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="font-semibold">Category: {recipe.category}</p>
      <p className="font-semibold">Likes: {recipe.likes || 0}</p>
      <p className="font-semibold mt-3">Comments:</p>
      <ul className="list-disc list-inside">
        {recipe.comments && recipe.comments.length > 0
          ? recipe.comments.map((c, i) => <li key={i}>{c}</li>)
          : "Future Enhancements."}
      </ul>
    </div>
  );
};

export default RecipeDetails;
