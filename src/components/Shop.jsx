import React from "react";
import UpgradeCard from "./UpgradeCard";

const Shop = ({
  coins,
  setCoins,
  setIncomePerSec,
  priceMultiplier = 1,
  upgrades,
  resetSignal,
  darkMode,
  ownedUpgrades = {},
}) => {
  return (
    <div className="mt-8 w-full max-w-6xl mx-auto px-4">
      {/* Shop Header */}
      <h2
        className={`text-3xl font-extrabold mb-6 text-center ${
          darkMode ? "text-yellow-300" : "text-yellow-800"
        }`}
      >
        🏰 Shop
      </h2>

      {/* Upgrades Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {upgrades.map((item) => (
          <UpgradeCard
            key={item.id}
            item={item}
            coins={coins}
            setCoins={setCoins}
            setIncomePerSec={setIncomePerSec}
            priceMultiplier={priceMultiplier}
            resetSignal={resetSignal}
            darkMode={darkMode}
            owned={ownedUpgrades[item.id] || 0}
          />
        ))}
      </div>

      {/* Optional Footer */}
      <div className="mt-6 text-center text-sm text-gray-400">
        Upgrade your kingdom to earn more coins! 💰
      </div>
    </div>
  );
};

export default Shop;
