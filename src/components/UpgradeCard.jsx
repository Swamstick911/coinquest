import React, { useState, useEffect } from "react";

const UpgradeCard = ({
  item,
  coins, 
  setCoins,
  setIncomePerSec,
  priceMultiplier = 1,
  resetSignal,
  darkMode,
}) => {
  const [owned, setOwned] = useState(() => {
    const saved = localStorage.getItem(`upgrade=${item.id}-owned`);
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => setOwned(0), [resetSignal]);

  const effectiveCost = Math.ceil(item.cost * priceMultiplier * Math.pow(1.15, owned));
  const canBuy = coins >= effectiveCost;

  const handleBuy = () => {
    if(!canBuy) return;
    setCoins((prev) => Math.round(prev - effectiveCost));
    setIncomePerSec((prev) => Math.round(prev + item.incomePerSec));
    const newOwned = owned + 1;
    setOwned(newOwned);
    localStorage.setItem(`upgrade-${item.id}-owned`, newOwned);
  };

  return (
    <div
      onClick={handleBuy}
      className={`relative border rounded-2xl p-5 text-center transform transition-all duration-300 cursor-pointer shadow-lg
        ${canBuy ? "hover:scale-105 hover:shadow-2xl" : "cursor-not-allowed opacity-60"}
        ${darkMode
          ? canBuy
            ? "bg-green-800 border-green-600 text-white hover:bg-green-700"
            : "bg-gray-700 border-gray-600 text-gray-300"
          : canBuy
          ? "bg-green-100 border-green-300 text-gray-800 hover:bg-green-200"
          : "bg-gray-200 border-gray-300 text-gray-500"
        }
      `}
    >
      {/* Name */}
      <h3 className="text-xl font-semibold mb-2">{item.name}</h3>

      {/* Cost */}
      <p className="font-bold text-yellow-400 mb-1">💰 {effectiveCost}</p>

      {/* Income per sec */}
      <p className="text-sm mb-1">Income/sec: {item.incomePerSec}</p>

      {/* Owned count */}
      {owned > 0 && (
        <p className="text-xs mt-1 text-gray-300 dark:text-gray-400">
          Owned: {owned}
        </p>
      )}

      {/* Glow effect for affordable */}
      {canBuy && (
        <span className="absolute top-0 left-0 w-full h-full rounded-2xl pointer-events-none bg-green-500 opacity-10 animate-pulse"></span>
      )}
    </div>
  );
};

export default UpgradeCard;