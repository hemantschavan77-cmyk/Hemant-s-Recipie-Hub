import React from 'react';
import Header from './Components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SubmitRecipie from './Components/SubmitRecipie';
import Home from './Components/Home';
import Login from './Components/Login';
import RecipeDetails from "./Components/RecipeDetails";
import MyRecipes from './Components/MyRecipes';
import SavedRecipes from './Components/SavedRecipes';
import { Toaster } from 'react-hot-toast';
import PopularRecipes from './Components/PopularRecipes';



const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Router>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#FFF7ED',
              color: '#9A3412',
              border: '1px solid #FED7AA',
              borderRadius: '12px',
              padding: '12px 16px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#EA580C',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#DC2626',
                secondary: '#FFFFFF',
              },
            },
          }}
        />

        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/submit" element={<SubmitRecipie />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recipe-details/:id" element={<RecipeDetails />} />
          <Route path='/my-recipes' element={<MyRecipes />} />
          <Route path='/saved-recipes' element={<SavedRecipes />} />
          <Route path='/popular-recipes' element={<PopularRecipes/>}/>
        </Routes>
      </Router>

      <footer className="bg-gray-800 text-white text-center p-4 mt-12">
        &copy; {new Date().getFullYear()} Hemant's Recipe Hub. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
