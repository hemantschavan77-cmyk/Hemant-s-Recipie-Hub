import React, { useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import RecipeCard from "./RecipieCard";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Home = () => {
  const navigate = useNavigate();

  const [allRecipes, setAllRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api.get("/api/recipes")
      .then((res) => {
        const recipes = res.data.content;
        const prepared = recipes.map((r) => ({
          likes: r.likes || 0,
          comments: r.comments || [],
          ...r
        }));
        setAllRecipes(prepared);
        setFilteredRecipes(prepared);
      })
      .catch((err) => {
        console.error("Error fetching recipies" + err);
      });
  }, []);

  const filterRecipes = (categoryArg, searchArg, source = allRecipes) => {
    let filtered = source;

    if (categoryArg) {
      filtered = filtered.filter(
        (r) => (r.category || "").toLowerCase() === categoryArg.toLowerCase()
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

    if (!term.trim()) {
      api
        .get("/api/recipes")
        .then((res) => {
          const recipes = res.data.content;
          setAllRecipes(recipes);
          filterRecipes(selectedCategory, "", recipes);
        })
        .catch((err) => {
          console.error("Failed to fetch recipes", err);
        });

      return;
    }

    api
      .get("/api/recipes/search", {
        params: { title: term },
      })
      .then((res) => {
        const recipes = res.data.content;
        setAllRecipes(recipes);
        filterRecipes(selectedCategory, term, recipes);
      })
      .catch((err) => {
        console.error("Search failed", err);
      });
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
        filterRecipes(selectedCategory, searchTerm, updatedList);
      })
      .catch((err) => {
        console.error("Failed to like recipe", err);
        alert("Failed to like recipe");
      });
  };

  const handleSaveRecipe = (id) => {
    api
      .patch(`/api/recipes/${id}/save`)
      .then((res) => {
        const isSaved = res.data;

        alert(
          isSaved
            ? "Recipe saved successfully!"
            : "Recipe removed from saved recipes."
        );
      })
      .catch((err) => {
        console.error("Failed to save recipe", err);

        if (err.response?.status === 401 || err.response?.status === 403) {
          alert("Your session may have expired. Please log in again.");
        } else {
          alert("Failed to update saved recipe. Please try again.");
        }
      });
  };


  const handleDeleteRecipe = (id) => {
    api
      .delete(`/api/recipes/${id}`)
      .then(() => {
        const updated = allRecipes.filter((r) => r.id !== id);

        setAllRecipes(updated);
        filterRecipes(selectedCategory, searchTerm, updated);
      })
      .catch((err) => {
        console.error("Failed to delete recipe", err);
        alert("Failed to delete recipe");
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
                  onSave={handleSaveRecipe}
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
