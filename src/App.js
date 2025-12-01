import React from 'react';
import Header from './Components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SubmitRecipie from './Components/SubmitRecipie';
import Home from './Components/Home';
import Login from './Components/Login';
import RecipeDetails from "./Components/RecipeDetails";


const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/submit" element={<SubmitRecipie />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recipe-details" element={<RecipeDetails />} />
        </Routes>
      </Router>

      <footer className="bg-gray-800 text-white text-center p-4 mt-12">
        &copy; {new Date().getFullYear()} Hemant's Recipe Hub. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
