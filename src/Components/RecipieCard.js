import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { HiOutlineBookmark } from 'react-icons/hi';
import { getToken } from '../utils/authStorage';

const RecipeCard = ({ recipe, onViewRecipe, onLike, onDelete, onSave }) => {
  const { title, imageBase64, category, rating = 3, id } = recipe;

  
  const likes = recipe.likes || 0;

  const handleLike = (e) => {
    e.stopPropagation();
    if(!getToken())
    {
      alert("Please Log in to like recipes");
      return;
    }

    if (onLike)
      { 
        onLike();
      } 
  };

  const handleSave = (e) => {
  e.stopPropagation();

    if (!getToken()) {
      alert("Please log in to save recipes.");
      return;
    }

    if (onSave) {
      onSave(id);
    }
  };

  const renderStars = (ratingVal) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= ratingVal ? (
          <FaStar key={i} className="text-yellow-500 w-4 h-4" />
        ) : (
          <FaRegStar key={i} className="text-gray-300 w-4 h-4" />
        )
        );
    }
    return <div className="flex">{stars}</div>;
  };

  const handleDelete = (e) => {
    e.stopPropagation(); 
    if (onDelete) onDelete(id);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden group cursor-pointer" onClick={onViewRecipe}>
      <div className="relative">
        <img
          src={imageBase64 || 'default-recipe.jpg'}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        <span
          className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full text-white ${
            (category || '').toLowerCase() === 'spicy' ? 'bg-red-500' : 'bg-amber-700'
          }`}
        >
          {category}
        </span>
        <button
          onClick={handleSave}
          aria-label="Save recipe"
          title="Save recipe"
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-orange-500 transition"
        >
          <HiOutlineBookmark className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">{title}</h3>
        {renderStars(rating)}
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 py-1 px-2 bg-orange-100 text-orange-600 rounded-lg text-sm hover:bg-orange-200 transition"
          >
            👍 {likes}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); if (onViewRecipe) onViewRecipe(); }}
            className="flex-1 py-1 text-sm bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition"
          >
            View Recipe
          </button>
          <button
            onClick={handleDelete}
            className="py-1 px-2 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>  
  );
  
};
export default RecipeCard;
