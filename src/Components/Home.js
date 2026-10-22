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
                  onSave={handleSaveRecipe}
                  showDelete={false}
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
