import React, { useState, useEffect } from "react";

export default function Achievement({ coins, incomePerSec, addCoins, applyBuff, applyPermanent, resetSignal, showList, setShowList, darkMode }) {
  const initialAchievements = [
    { id: "coins100", name: "First Fortune", description: "Earn 100 coins", unlocked: false, reward: { type: "coins", value: 50 }, condition: (coins) => coins >= 100 },
    { id: "income10", name: "Rising Economy", description: "Reach 10 income/sec", unlocked: false, reward: { type: "permanent", effect: "incomeMultiplier", value: 0.1 }, condition: (coins, incomePerSec) => incomePerSec >= 10 },
    { id: "coins10000", name: "Merchant King", description: "Accumulate 10,000 coins", unlocked: false, reward: { type: "buff", effect: "incomeMultiplier", value: 2, duration: 60 }, condition: (coins) => coins >= 10000 },
    { id: "coins10000000", name: "Richest in the Country", description: "Accumulate 10,000,000 coins", unlocked: false, reward: { type: "buff", effect: "incomeMultiplier", value: 4, duration: 120 }, condition: (coins) => coins >= 10000000 },
  ];

  const attachConditions = (achList) => achList.map(a => { const match = initialAchievements.find(i => i.id === a.id); return match ? { ...a, condition: match.condition } : a; });

  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem("achievements");
    return saved ? attachConditions(JSON.parse(saved)) : initialAchievements;
  });

  const [banner, setBanner] = useState(null);

  useEffect(() => setAchievements(attachConditions(initialAchievements)), [resetSignal]);
  useEffect(() => localStorage.setItem("achievements", JSON.stringify(achievements)), [achievements]);

  useEffect(() => {
    achievements.forEach(a => {
      if (a.condition && !a.unlocked && a.condition(coins, incomePerSec)) unlockAchievement(a);
    });
  }, [coins, incomePerSec]);

  const unlockAchievement = (ach) => {
    setAchievements(prev => prev.map(a => (a.id === ach.id ? { ...a, unlocked: true } : a)));
    switch (ach.reward.type) {
      case "coins": addCoins(ach.reward.value); break;
      case "buff": applyBuff(ach.reward); break;
      case "permanent": applyPermanent(ach.reward); break;
      default: break;
    }
    setBanner(`${ach.name} unlocked! 🎉 Reward: ${describeReward(ach.reward)}`);
    setTimeout(() => setBanner(null), 4000);
  };

  const describeReward = (reward) => {
    switch (reward.type) {
      case "coins": return `+${reward.value} coins`;
      case "buff": return `x${reward.value} income for ${reward.duration || 0}s`;
      case "permanent": return `+${Math.round(reward.value * 100)}% permanent boost`;
      default: return "Reward unlocked!";
    }
  };

  return (
    <>
      {banner && (
        <div className="fixed top-5 right-5 p-4 rounded-xl shadow-xl animate-bounce z-50 bg-yellow-500 text-white">
          {banner}
        </div>
      )}

      {showList && (
        <div className={`fixed top-20 right-5 w-64 max-h-[70vh] overflow-y-auto p-4 rounded-xl shadow-xl z-50 ${darkMode ? "bg-gray-800 text-white" : "bg-yellow-100 text-yellow-800"}`}>
          <h3 className="font-bold text-lg mb-2">Achievements</h3>
          {achievements.map(a => (
            <div key={a.id} className={`p-2 mb-2 rounded-md border ${a.unlocked ? "border-green-600 bg-green-100" : "border-gray-400 bg-gray-100"} ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}>
              <div className="font-semibold">{a.name}</div>
              <div className="text-sm">{a.description}</div>
              {a.unlocked && <div className="text-xs mt-1 text-green-700">Reward: {describeReward(a.reward)}</div>}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
