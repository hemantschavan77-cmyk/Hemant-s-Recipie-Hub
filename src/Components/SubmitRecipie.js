import React, { useState } from 'react';
// import { saveRecipe } from '../utils/localStorage';  //replaced with backend
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const RecipeIcon = () => <span className="text-xl">🍲</span>;
const IngredientIcon = () => <span className="text-xl">🥕</span>;
const TagIcon = () => <span className="text-xl">🏷</span>;
const PhotoIcon = () => <span className="text-xl">📸</span>;
const PlusIcon = () => <span className="text-xl">+</span>;
const RemoveIcon = () => <span className="text-xl">❌</span>;
const CategoryIcon = () => <span className="text-xl">🧑‍🍳</span>;

const SubmitRecipie = () => {
  const categories = ['Main Course', 'Snacks', 'Dessert', 'Beverage', 'Side Dish', 'Soup/Stew', 'Breakfast','spicy'];

  const [recipeTitle, setRecipeTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Main Course');
  const [ingredients, setIngredients] = useState(['']);
  const [tags, setTags] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const navigate = useNavigate();

  
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };
  const handleAddIngredient = () => setIngredients([...ingredients, '']);
  const handleRemoveIngredient = (index) => setIngredients(ingredients.filter((_, i) => i !== index));

  
  const handleTagChange = (e) => {
    const inputString = e.target.value;
    const newTags = inputString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setTags(newTags);
  };

  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
  !recipeTitle.trim() ||
  !description.trim() ||
  !category ||
  ingredients.length === 0 ||
  ingredients.every((i) => !i.trim())
) {
  toast.error("Please fill out all required fields.");
  return;
}

    
  api.post("/api/recipes", {
  title: recipeTitle.trim(),
  category,
  description: description.trim(),
  ingredients: ingredients.filter(i => i.trim() !== ''),
  tags,
  imageBase64: imageFile || null,
})
.then((res) => {
  const savedRecipe = res.data;

  toast.success("Recipe submitted successfully!");

  setModalData({
    title: "Recipe submitted successfully!",
    message: "Your recipe has been saved and will appear on the home page.",
    details: savedRecipe,
  });

  setIsModalOpen(true);

  setRecipeTitle('');
  setDescription('');
  setCategory('Main Course');
  setIngredients(['']);
  setTags([]);
  setImageFile(null);
})
.catch((err) => {
  console.error("Failed to submit recipe:", err);

  const message =
    typeof err.response?.data === "string"
      ? err.response.data
      : err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to submit recipe. Please try again.";

  toast.error(message);
});

    
    
  };

  const SubmissionModal = () => {
    if (!isModalOpen || !modalData) return null;
    const isError = modalData.title.toLowerCase().includes('error');
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={() => setIsModalOpen(false)}>
        <div className="bg-white rounded-lg p-6 max-w-lg w-full" onClick={e => e.stopPropagation()}>
          <h2 className={`text-xl font-bold mb-2 ${isError ? 'text-red-600' : 'text-orange-600'}`}>
            {isError ? '⚠ ' : '✅ '} {modalData.title}
          </h2>
          <p className="text-gray-700 mb-4">{modalData.message}</p>
          {modalData.details && (
            <div className="bg-gray-100 p-4 rounded mb-4 text-left">
              <h3 className="font-semibold mb-2 border-b border-gray-300 pb-1">Details Captured:</h3>
              <p><strong>Title:</strong> {modalData.details.title}</p>
              <p><strong>Category:</strong> {modalData.details.category}</p>
              <p><strong>Tags:</strong> {(modalData.details.tags && modalData.details.tags.length > 0) ? modalData.details.tags.join(', ') : 'None'}</p>
              <p><strong>Ingredients ({modalData.details.ingredients.length}):</strong></p>
              <ul className="list-disc list-inside max-h-32 overflow-y-auto">
                {modalData.details.ingredients.map((item, index) => <li key={index} className="text-sm">{item}</li>)}
              </ul>
              {modalData.details.imageBase64 && (
  <img src={modalData.details.imageBase64} alt="Recipe" className="mt-2 w-full h-48 object-cover rounded" /> )}

            </div>
          )}
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { setIsModalOpen(false); navigate('/'); }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded"
            >
              Close & Go Home
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-100 p-6">
      <SubmissionModal />
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-orange-600 mb-2">Upload Your Recipe <RecipeIcon /></h1>
          <p className="text-gray-600">All fields are required.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-1">Recipe Title</label>
            <input type="text" value={recipeTitle} onChange={e => setRecipeTitle(e.target.value)} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-400 focus:outline-none" />
          </div>

          <div>
            <label className="block font-semibold mb-1">Recipe Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-400 focus:outline-none" />
          </div>

          <div>
            <label className="block font-semibold mb-1">Category <CategoryIcon /></label>
            <select value={category} onChange={e => setCategory(e.target.value)} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-400 focus:outline-none">
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Ingredients <IngredientIcon /></label>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <input type="text" value={ingredient} onChange={e => handleIngredientChange(index, e.target.value)} required={index===0} className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-400 focus:outline-none" />
                  {ingredients.length > 1 && <button type="button" onClick={() => handleRemoveIngredient(index)} className="bg-red-500 hover:bg-red-600 text-white rounded px-2"><RemoveIcon /></button>}
                </div>
              ))}
              <button type="button" onClick={handleAddIngredient} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded"><PlusIcon /> Add Ingredient</button>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Tags <TagIcon /></label>
            <input type="text" value={tags.join(', ')} onChange={handleTagChange} placeholder="comma separated tags e.g. spicy, street-food" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-400 focus:outline-none" />
          </div>

          <div>
            <label className="block font-semibold mb-1">Recipe Photo <PhotoIcon /></label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="block mb-2" />
            {imageFile && <p className="text-gray-700">File selected</p>}
          </div>

          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold p-3 rounded-lg">Submit Recipe</button>
        </form>
      </div>
    </div>
  );
};

export default SubmitRecipie;



