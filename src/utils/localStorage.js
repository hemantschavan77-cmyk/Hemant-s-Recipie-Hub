// src/utils/localStorage.js

// Recipe functions
const RECIPE_KEY = 'recipes';

export const getRecipes = () => {
  try {
    const stored = localStorage.getItem(RECIPE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to parse recipes from localStorage:", error);
    return [];
  }
};

export const saveRecipe = (recipe) => {
  const existingRecipes = getRecipes();
  const newRecipes = [...existingRecipes, { id: Date.now(), ...recipe }];
  try {
    localStorage.setItem(RECIPE_KEY, JSON.stringify(newRecipes));
  } catch (error) {
    console.error("Failed to save recipe to localStorage:", error);
  }
  return newRecipes;
};

export const removeRecipe = (recipeId) => {
  const existingRecipes = getRecipes();
  const filtered = existingRecipes.filter(r => r.id !== recipeId);
  try {
    localStorage.setItem(RECIPE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to remove recipe from localStorage:", error);
  }
  return filtered;
};

export const clearRecipes = () => {
  try {
    localStorage.removeItem(RECIPE_KEY);
  } catch (error) {
    console.error("Failed to clear recipes from localStorage:", error);
  }
};

// User functions
const USER_KEY = 'users';
const LOGGEDIN_KEY = 'loggedInUser';

export const saveUser = (user) => {
  const users = getUsers();
  users.push(user);
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Failed to save user:", error);
  }
};

export const getUsers = () => {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to get users:", error);
    return [];
  }
};

export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem(LOGGEDIN_KEY, JSON.stringify(user));
    return user;
  }
  return null;
};

export const getLoggedInUser = () => {
  try {
    const stored = localStorage.getItem(LOGGEDIN_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to get logged in user:", error);
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem(LOGGEDIN_KEY);
};
