import React, { useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import RecipeCard from "./RecipieCard";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const Home = () => {
  const navigate = useNavigate();

  const [allRecipes, setAllRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [popularRecipes, setPopularRecipes] = useState([]);


  useEffect(() => {
    const params = {
      page: currentPage,
      size: 12,
    };

    if (selectedCategory) {
      params.category = selectedCategory;
    }

    const request = searchTerm.trim()
      ? api.get("/api/recipes/search", {
        params: { ...params, title: searchTerm.trim() },
      })
      : api.get("/api/recipes", { params });

    request
      .then((res) => {
        const recipes = res.data.content || [];
        setAllRecipes(recipes);
        setFilteredRecipes(recipes);
        setTotalPages(res.data.totalPages || 0);
      })
      .catch((err) => {
        console.error("Failed to fetch recipes:", err);
        toast.error("Failed to load recipes.");
      });
  }, [currentPage, selectedCategory, searchTerm]);


  useEffect(() => {
    api
      .get("/api/recipes/popular", {
        params: { page: 0, size: 4 },
      })
      .then((res) => {
        setPopularRecipes(res.data.content || []);
      })
      .catch((err) => {
        console.error("Failed to fetch popular recipes:", err);
      });
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(0);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(0);
  };


  const handleLike = (id) => {
    api
      .patch(`/api/recipes/${id}/like`)
      .then((res) => {
        const updatedRecipe = res.data;

        const updatedList = allRecipes.map((r) =>
          r.id === updatedRecipe.id ? updatedRecipe : r
        );

        setAllRecipes(updatedList);
        setFilteredRecipes(updatedList);
        setPopularRecipes((recipes) =>
  recipes.map((recipe) =>
    recipe.id === updatedRecipe.id ? updatedRecipe : recipe
  )
);
      })
      .catch((err) => {
        console.error("Failed to like recipe", err);
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
        const isSaved = res.data;

        if (isSaved) {
          toast.success("Recipe saved successfully!");
        } else {
          toast("Recipe removed from saved recipes.");
        }
      })
      .catch((err) => {
        console.error("Failed to save recipe", err);

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
    <main>
      <HeroSection
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategorySelect}
        onSearch={handleSearch}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="mt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-orange-500 inline-block pb-1">
            Explore Recipes {selectedCategory ? `- ${selectedCategory}` : ""}
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
                  onSave={handleSaveRecipe}
                  showDelete={false}
                />
              ))
            )}
          </div>
          {totalPages > 1 && (
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
        <section className="mt-16">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-orange-500 pb-1">
              Popular Recipes
            </h2>

            <button
              onClick={() => navigate("/popular-recipes")}
              className="px-5 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition"
            >
              View All
            </button>
          </div>

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
        </section>
      </div>
    </main>
  );
};

export default Home;
