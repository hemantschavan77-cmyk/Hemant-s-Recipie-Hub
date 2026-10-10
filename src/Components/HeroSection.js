import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

const HeroSection = ({ selectedCategory, setSelectedCategory, onSearch }) => {
  const categories = ['Main Course', 'Snacks', 'Dessert', 'Beverage', 'Side Dish', 'Soup/Stew', 'Breakfast','spicy'];
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value); 
  };
  return (
    <div
      className="relative h-96 bg-cover bg-center flex items-center justify-center text-white p-4"
      style={{
        backgroundImage: "url('HeroImage.jpg')",
        background:
          'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("HeroImage.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="text-center z-10 w-full">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 drop-shadow-lg">
          Let's Find something Tasty!!
        </h1>

        <div className="relative w-full max-w-xl mx-auto px-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Find recipes..."
            className="w-full py-3 pl-12 pr-4 text-gray-800 rounded-full shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <FiSearch className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-3 px-4">
  {categories.map((cat) => (
    <button
      key={cat}
      className={`px-4 py-1 text-sm bg-white bg-opacity-80 text-black rounded-full hover:bg-opacity-100 transition ${
        selectedCategory === cat ? 'ring-2 ring-orange-300' : ''
      }`}
      onClick={() => setSelectedCategory(cat)}
    >
      {cat}
    </button>
  ))}

  <button
    className="px-4 py-1 text-sm bg-white bg-opacity-80 text-black rounded-full hover:bg-opacity-100 transition"
    onClick={() => setSelectedCategory('')}
  >
    All
  </button>
</div>

      </div>
    </div>
  );
};

export default HeroSection;
