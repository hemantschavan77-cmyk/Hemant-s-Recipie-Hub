import React, { useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import RecipeCard from "./RecipieCard";
import { useNavigate } from "react-router-dom";
import { getRecipes, removeRecipe } from "../utils/localStorage";

const Home = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Load recipes once on mount
  useEffect(() => {
    const stored = getRecipes();
    // ensure likes and comments exist
    const recipesWithExtras = stored.map((r) => ({
      likes: r.likes || 0,
      comments: r.comments || [],
      ...r,
    }));
    setRecipes(recipesWithExtras);
    setFilteredRecipes(recipesWithExtras);
  }, []);

  // Filter helper uses either provided sourceRecipes or state
  const filterRecipes = (categoryArg, searchArg, sourceRecipes) => {
    const src = Array.isArray(sourceRecipes) ? sourceRecipes : recipes;
    let filtered = src;
    if (categoryArg) {
      filtered = filtered.filter((r) => (r.category || "").toLowerCase() === categoryArg.toLowerCase());
    }
    if (searchArg) {
      filtered = filtered.filter((r) =>
        (r.title || "").toLowerCase().includes(searchArg.toLowerCase())
      );
    }
    setFilteredRecipes(filtered);
  };

  // When category changed from HeroSection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    filterRecipes(category, searchTerm);
  };

  // Search handler (from HeroSection)
  const handleSearch = (term) => {
    setSearchTerm(term);
    filterRecipes(selectedCategory, term);
  };

  // Like handler: parent owns likes and persists them
  const handleLike = (id) => {
    const updated = recipes.map((r) => {
      if (r.id === id) return { ...r, likes: (r.likes || 0) + 1 };
      return r;
    });
    // persist whole list
    try {
      localStorage.setItem("recipes", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save recipes after like:", err);
    }
    setRecipes(updated);
    // update filtered list based on current filters (use updated)
    filterRecipes(selectedCategory, searchTerm, updated);
  };

  const handleDeleteRecipe = (id) => {
    // use removeRecipe util to persist
    const updated = removeRecipe(id);
    // removeRecipe returns the new list from util
    const recipesWithExtras = updated.map((r) => ({
      likes: r.likes || 0,
      comments: r.comments || [],
      ...r,
    }));
    setRecipes(recipesWithExtras);
    filterRecipes(selectedCategory, searchTerm, recipesWithExtras);
  };

  const handleViewRecipe = (recipe) => {
    navigate("/recipe-details", { state: { recipe } });
  };

  return (
    <main>
      <HeroSection
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategorySelect}
        onSearch={handleSearch} // pass search handler
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
