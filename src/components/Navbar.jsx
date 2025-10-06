import React from "react";
import ComicButton from "./ComicButton";

const Navbar = ({ coins, incomePerSec, onReset, toggleAchievements, darkMode, toggleDarkMode }) => {
  return (
    <div className={`w-full flex justify-between items-center p-4 rounded-xl shadow-lg
      ${darkMode ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"} animate-fadeIn`}>
      
      <div className="flex flex-col animate-fadeIn">
        <span className={`font-bold ${darkMode ? "text-yellow-300 drop-shadow-lg" : "text-yellow-800"}`}>💰 Coins: {Math.round(coins)}</span>
        <span className={`font-bold ${darkMode ? "text-yellow-300 drop-shadow-lg" : "text-yellow-800"}`}>Income/sec: {Math.round(incomePerSec)}</span>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className={`px-3 py-1 rounded shadow-lg transition-all duration-300 hover:scale-105 ${darkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
        >
          {darkMode ? "🌙 Dark" : "☀️ Light"}
        </button>

        <ComicButton
          text={"Achievements"}
          onClick={toggleAchievements}
          className="bg-yellow-600 text-white px-3 py-1 rounded shadow-lg transition-all duration-300 hover:scale-105"
        />

        <ComicButton
          text={"Reset"}
          onClick={onReset}
          className="bg-red-500 text-white px-3 py-1 rounded shadow-lg transition-all duration-300 hover:scale-105"
        />
      </div>
    </div>
  );
};

export default Navbar;
