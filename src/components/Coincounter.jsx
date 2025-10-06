import React from "react";

const CoinCounter = ({ coins, incomePerSec, activeBuffs = [] }) => {
  // Calculate total multiplier from active buffs
  const buffMultiplier = activeBuffs.reduce(
    (acc, b) => (b.effect === "incomeMultiplier" ? acc * b.value : acc),
    1
  );

  const showMultiplier = buffMultiplier > 1;

  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-yellow-100 rounded-xl shadow-md select-none">
      {/* Coins
      <div className="flex items-center gap-2 text-4xl font-extrabold text-yellow-700">
        <span>💰</span>
        <span>{Math.round(coins)}</span>
      </div>

      {/* Income per second }
      <div className="flex items-center gap-2 text-lg font-bold text-yellow-600">
        ⚡ <span>{Math.round(incomePerSec)}/sec</span>
        {showMultiplier && (
          <span className="ml-2 px-2 py-1 bg-yellow-500 text-white rounded-full text-sm animate-pulse">
            x{buffMultiplier}
          </span>
        )} 
      </div> */}
    </div>
  );
};

export default CoinCounter;
