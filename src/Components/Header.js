import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getToken, logoutUser } from '../utils/authStorage';
import toast from 'react-hot-toast';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getToken());


  useEffect(() => {
    const syncAuthStatus = () => {
      setIsLoggedIn(!!getToken());
    };

    window.addEventListener("authChange", syncAuthStatus);

    return () => {
      window.removeEventListener("authChange", syncAuthStatus);
    };
  }, []);


  const getLinkClasses = (path, isMobile = false) => {
    const isActive = location.pathname === path;

    if (isMobile) {
      return `block px-4 py-2.5 rounded-xl font-medium transition-all duration-200 no-underline ${isActive
        ? 'bg-orange-500 text-white shadow-sm'
        : 'bg-gray-50 text-gray-800 hover:bg-orange-50 hover:text-orange-600 active:scale-[0.98]'
        }`;
    }

    return `relative px-4 py-2 rounded-full font-medium transition-all duration-200 no-underline transform active:scale-95 ${isActive
      ? 'bg-orange-100 text-orange-600 font-semibold shadow-inner'
      : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:-translate-y-0.5'
      }`;
  };

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    setIsOpen(false);
    navigate('/');
  };

  const handleRestrictedNavigation = (e, path, feature) => {
    if (!getToken()) {
      e.preventDefault();
      setIsOpen(false);
      toast.error(`Please log in or sign up to access ${feature}.`, {
        duration: 3000,
      });
      navigate('/login', {
        state: { from: path },
      });
    } else {
      setIsOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md transition-shadow duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">

        {/* Brand Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-orange-600 cursor-pointer select-none no-underline tracking-tight transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          Hemant's Recipe Hub
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-3 items-center">
          <Link to="/" className={getLinkClasses('/')}>
            Home
          </Link>

          <Link
            to="/submit"
            onClick={(e) =>
              handleRestrictedNavigation(e, '/submit', 'Upload Recipe')
            }
            className={getLinkClasses('/submit')}
          >
            Upload Recipe
          </Link>

          <Link
            to="/my-recipes"
            onClick={(e) =>
              handleRestrictedNavigation(e, '/my-recipes', 'My Recipes')
            }
            className={getLinkClasses('/my-recipes')}
          >
            My Recipes
          </Link>

          <Link
            to="/saved-recipes"
            onClick={(e) =>
              handleRestrictedNavigation(e, '/saved-recipes', 'Saved Recipes')
            }
            className={getLinkClasses('/saved-recipes')}
          >
            Saved Recipes
          </Link>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-orange-500 text-white font-semibold rounded-full shadow-sm hover:bg-orange-600 hover:shadow-md hover:shadow-orange-500/20 active:scale-95 transition-all duration-200 transform"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 bg-orange-500 text-white font-semibold rounded-full shadow-sm hover:bg-orange-600 hover:shadow-md hover:shadow-orange-500/20 active:scale-95 transition-all duration-200 transform"
            >
              Login / Sign Up
            </button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            aria-label="Toggle Navigation Menu"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 focus:outline-none transition-colors duration-200 active:scale-90"
          >
            {isOpen ? (
              <FaTimes className="text-2xl transition-transform duration-200 rotate-90" />
            ) : (
              <FaBars className="text-2xl transition-transform duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-5 space-y-2 shadow-lg transition-all duration-200 animate-slideDown">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={getLinkClasses('/', true)}
          >
            Home
          </Link>

          <Link
            to="/submit"
            onClick={(e) =>
              handleRestrictedNavigation(e, '/submit', 'Upload Recipe')
            }
            className={getLinkClasses('/submit', true)}
          >
            Upload Recipe
          </Link>

          <Link
            to="/my-recipes"
            onClick={(e) =>
              handleRestrictedNavigation(e, '/my-recipes', 'My Recipes')
            }
            className={getLinkClasses('/my-recipes', true)}
          >
            My Recipes
          </Link>

          <Link
            to="/saved-recipes"
            onClick={(e) =>
              handleRestrictedNavigation(e, '/saved-recipes', 'Saved Recipes')
            }
            className={getLinkClasses('/saved-recipes', true)}
          >
            Saved Recipes
          </Link>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full mt-2 px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl shadow hover:bg-orange-600 active:scale-[0.98] transition-all duration-200"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/login');
              }}
              className="w-full mt-2 px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl shadow hover:bg-orange-600 active:scale-[0.98] transition-all duration-200"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;