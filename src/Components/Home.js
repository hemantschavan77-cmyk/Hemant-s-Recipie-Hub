import React, { useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import RecipeCard from "./RecipieCard";
import { useNavigate } from "react-router-dom";
import { getRecipes, removeRecipe } from "../utils/localStorage";

const Home = () => {
  const navigate = useNavigate();

  const [allRecipes, setAllRecipes] = useState([]); 
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  
  useEffect(() => {
    const stored = getRecipes();
    const prepared = stored.map((r) => ({
      likes: r.likes || 0,
      comments: r.comments || [],
      ...r,
    }));
    setAllRecipes(prepared);
    setFilteredRecipes(prepared);
  }, []);

  
  const filterRecipes = (categoryArg, searchArg, source = allRecipes) => {
    let filtered = source;

    if (categoryArg) {
      filtered = filtered.filter(
        (r) => (r.category || "").toLowerCase() === categoryArg.toLowerCase()
      );
    }

    if (searchArg) {
      filtered = filtered.filter((r) =>
        (r.title || "").toLowerCase().includes(searchArg.toLowerCase())
      );
    }

    setFilteredRecipes(filtered);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    filterRecipes(category, searchTerm);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterRecipes(selectedCategory, term);
  };

  const handleLike = (id) => {
    const updated = allRecipes.map((r) =>
      r.id === id ? { ...r, likes: (r.likes || 0) + 1 } : r
    );

    localStorage.setItem("recipes", JSON.stringify(updated));
    setAllRecipes(updated);

    filterRecipes(selectedCategory, searchTerm, updated);
  };

  const handleDeleteRecipe = (id) => {
    const updated = removeRecipe(id);

    const prepared = updated.map((r) => ({
      likes: r.likes || 0,
      comments: r.comments || [],
      ...r,
    }));

    setAllRecipes(prepared);
    filterRecipes(selectedCategory, searchTerm, prepared);
  };

  const handleViewRecipe = (recipe) => {
    navigate("/recipe-details", { state: { recipe } });
  };

  return (
    <main>
      <HeroSection
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategorySelect}
        onSearch={handleSearch}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="mt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-orange-500 inline-block pb-1">
            Your Recipes {selectedCategory ? `- ${selectedCategory}` : ""}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredRecipes.length === 0 ? (
              <p className="text-gray-500 col-span-full">No recipes found.</p>
            ) : (
              filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onViewRecipe={() => handleViewRecipe(recipe)}
                  onLike={() => handleLike(recipe.id)}
                  onDelete={() => handleDeleteRecipe(recipe.id)}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
