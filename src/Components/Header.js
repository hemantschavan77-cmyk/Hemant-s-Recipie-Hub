import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        
        <Link to="/" className="text-2xl font-extrabold text-orange-600 cursor-pointer select-none no-underline">
          Hemant's Recipe Hub
        </Link>

        
        <nav className="hidden md:flex space-x-4 items-center">
          <Link
            to="/"
            className="px-4 py-2 text-black bg-white rounded-full hover:bg-orange-100 hover:text-orange-600 transition duration-150 font-medium no-underline"
          >
            Home
          </Link>

          <Link
            to="/submit"
            className="px-4 py-2 text-black bg-white rounded-full hover:bg-orange-100 hover:text-orange-600 transition duration-150 font-medium no-underline"
          >
            Submit Recipe
          </Link>

          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition duration-150"
          >
            Login / Sign Up
          </button>
        </nav>

        
        <div className="md:hidden">
          <FaBars 
            className="text-2xl text-gray-700 cursor-pointer" 
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </div>

      
      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pb-4 space-y-3 animate-slideDown">
          <Link to="/" className="block px-4 py-2 rounded-lg bg-gray-100 text-black no-underline">Home</Link>

          <Link to="/submit" className="block px-4 py-2 rounded-lg bg-gray-100 text-black no-underline">Submit Recipe</Link>

          <button
            onClick={() => navigate('/login')}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Login / Sign Up
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
