import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Shop from "./components/Shop";
import EventPopup from "./components/EventPopup";
import Achievement from "./components/Achievement";
import { useCoinIncome } from "./hooks/useCoinIncome";
import { upgrades } from "./utils/upgrades";
import CoinPopup from "./components/CoinPopup";
import gsap from "gsap";

// Event pool
const eventPool = [
  { id: 1, name: "Festival!", effect: "Income doubled for 20s", type: "incomeBoost", multiplier: 2, duration: 20000 },
  { id: 2, name: "Drought!", effect: "Income halved for 20s", type: "incomePenalty", multiplier: 0.5, duration: 20000 },
  { id: 3, name: "Plague!", effect: "Upgrades cost +50% for 20s", type: "priceIncrease", multiplier: 1.5, duration: 20000 },
  { id: 4, name: "Gold Rush!", effect: "Income ×3 for 15s", type: "incomeBoost", multiplier: 3, duration: 15000 },
  { id: 5, name: "Lazy Workers...", effect: "Income ×0.5 for 20s", type: "incomePenalty", multiplier: 0.5, duration: 20000 },
  { id: 6, name: "Extra Shift!", effect: "Income ×1.5 for 30s", type: "incomeBoost", multiplier: 1.5, duration: 30000 },
  { id: 7, name: "Market Crash", effect: "Upgrade costs ×2 for 20s", type: "priceIncrease", multiplier: 2, duration: 20000 },
  { id: 8, name: "Festival Discounts!", effect: "Upgrade costs ×0.5 for 25s", type: "priceIncrease", multiplier: 0.5, duration: 25000 },
  { id: 9, name: "Royal Tax", effect: "Income ×0.8, Upgrades ×1.2 for 20s", type: "mixed", multiplier: { income: 0.8, price: 1.2 }, duration: 20000 },
  { id: 10, name: "Lucky Merchant", effect: "Income ×1.5, Upgrades ×0.8 for 25s", type: "mixed", multiplier: { income: 1.5, price: 0.8 }, duration: 25000 },
];

function App() {
  const [coins, setCoins] = useState(() => parseInt(localStorage.getItem("coins")) || 100);
  const [coinsSpent, setCoinsSpent] = useState(() => parseInt(localStorage.getItem("coinsSpent")) || 0);
  const [incomePerSec, setIncomePerSec] = useState(() => parseInt(localStorage.getItem("incomePerSec")) || 1);
  const [events, setEvents] = useState([]);
  const [multiplier, setMultiplier] = useState(1);
  const [priceMultiplier, setPriceMultiplier] = useState(1);
  const [permanentIncomeMultiplier, setPermanentIncomeMultiplier] = useState(1);
  const [activeBuffs, setActiveBuffs] = useState([]);
  const [resetSignal, setResetSignal] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [showAchievements, setShowAchievements] = useState(false);
  const [popups, setPopups] = useState([]);
  const [achievementTrigger, setAchievementTrigger] = useState(null);

  const containerRef = useRef(null);
  const coinsRef = useRef(null);
  const coinCounterRef = useRef(null); // Target for flying coins

  const [ownedUpgrades, setOwnedUpgrades] = useState(() => {
    const saved = localStorage.getItem("ownedCounts");
    return saved ? JSON.parse(saved) : {};
  });

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Animate app entry
  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
  }, []);

  // Animate coins bounce
  useEffect(() => {
    if (coinsRef.current) {
      gsap.fromTo(coinsRef.current, { scale: 1.2 }, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.4)" });
    }
  }, [coins]);

  // Dark mode animation
  useEffect(() => {
    gsap.to(containerRef.current, {
      backgroundColor: darkMode ? "#1f2937" : "#fef3c7",
      color: darkMode ? "#fff" : "#1f2937",
      duration: 0.7,
    });
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Effective income
  const buffMultiplier = activeBuffs.reduce((acc, b) => (b.effect === "incomeMultiplier" ? acc * b.value : acc), 1);
  const effectiveIncomePerSec = incomePerSec * multiplier * permanentIncomeMultiplier * buffMultiplier;
  useCoinIncome(coins, setCoins, effectiveIncomePerSec);

  // Save progress
  useEffect(() => localStorage.setItem("coins", coins), [coins]);
  useEffect(() => localStorage.setItem("coinsSpent", coinsSpent), [coinsSpent]);
  useEffect(() => localStorage.setItem("incomePerSec", incomePerSec), [incomePerSec]);
  useEffect(() => localStorage.setItem("ownedCounts", JSON.stringify(ownedUpgrades)), [ownedUpgrades]);

  // Random events
  useEffect(() => {
    const triggerEvent = () => {
      const event = eventPool[Math.floor(Math.random() * eventPool.length)];
      setEvents([event]);

      if (event.type === "incomeBoost" || event.type === "incomePenalty") {
        setMultiplier(event.multiplier);
        setTimeout(() => setMultiplier(1), event.duration);
      }
      if (event.type === "priceIncrease") {
        setPriceMultiplier(event.multiplier);
        setTimeout(() => setPriceMultiplier(1), event.duration);
      }
      if (event.type === "mixed") {
        setMultiplier(event.multiplier.income);
        setPriceMultiplier(event.multiplier.price);
        setTimeout(() => {
          setMultiplier(1);
          setPriceMultiplier(1);
        }, event.duration);
      }

      setTimeout(() => setEvents([]), event.duration);
    };

    const interval = setInterval(triggerEvent, Math.random() * 20000 + 20000);
    return () => clearInterval(interval);
  }, []);

  // Buff cleanup
  useEffect(() => {
    const t = setInterval(() => setActiveBuffs((prev) => prev.filter((b) => b.expiresAt > Date.now())), 1000);
    return () => clearInterval(t);
  }, []);

  const resetGame = () => {
    localStorage.clear();
    setCoins(100);
    setCoinsSpent(0);
    setIncomePerSec(1);
    setEvents([]);
    setMultiplier(1);
    setPriceMultiplier(1);
    setPermanentIncomeMultiplier(1);
    setActiveBuffs([]);
    setOwnedUpgrades({});
    setResetSignal((prev) => prev + 1);
  };

  // Flying coins with null-check
  const flyCoins = ( fromX, fromY, amount ) => {
    if (!coinCounterRef.current || !containerRef.current) return;

    const coinEl = document.createElement("div");
    coinEl.className = 
      "absolute w-6 h-6 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center text-black text-xs z-50";
      coinEl.innerText = amount;
      coinEl.style.left = `${fromX}px`;
      coinEl.style.top = `${fromY}px`;
      containerRef.current.appendChild(coinEl);

      const target = coinCounterRef.current.getBoundingClientRect();

      gsap.to(coinEl, {
        duration: 0.9,
        x: target.left - fromX + Math.random() * 20 - 10,
        y: target.top - fromY - 20,
        rotation: Math.random() * 360,
        scale: 0.5,
        ease: "power2.inOut",
        onComplete: () => coinEl.remove(),
      });
  };  

  // Confetti
  const showConfetti = () => {
    if (!containerRef.current) return;
    const confettiCount = 30;
    for (let i = 0; i < confettiCount; i++) {
      const conf = document.createElement("div");
      conf.className = "absolute w-2 h-4 bg-pink-400";
      conf.style.left = `${Math.random() * window.innerWidth}px`;
      conf.style.top = "-20px";
      containerRef.current.appendChild(conf);
      gsap.to(conf, {
        y: window.innerHeight + 50,
        rotation: Math.random() * 360,
        duration: Math.random() * 1 + 1,
        ease: "power2.out",
        onComplete: () => conf.remove(),
      });
    }
  };

  const addCoins = (amount, fromX, fromY) => {
    const x = fromX || window.innerWidth / 2 + (Math.random() * 100 - 50);
    const y = fromY || window.innerHeight / 2 + (Math.random() * 50 - 25);
    setCoins(prev => prev + amount);
    flyCoins(x, y, amount);

    const id = Date.now();
    setPopups(prev => [...prev, { id, x: Math.random() * 200 + 200, y: 300, amount }]);
  };


  const applyBuff = (buff) =>
    setActiveBuffs((prev) => [...prev, { ...buff, expiresAt: Date.now() + (buff.duration || 0) * 1000 }]);

  const applyPermanent = (reward) => {
    if (reward.effect === "incomeMultiplier") {
      setPermanentIncomeMultiplier((p) => p + reward.value);
      setAchievementTrigger(reward);
      if (reward.value >= 2) showConfetti();
    }
  };

  // Achievement animation
  useEffect(() => {
    if (achievementTrigger && containerRef.current) {
      const id = `achievement-${Date.now()}`;
      const el = document.createElement("div");
      el.id = id;
      el.innerText = `Achievement! +${achievementTrigger.value}x Income`;
      el.className =
        "absolute top-20 left-1/2 -translate-x-1/2 bg-yellow-400 px-4 py-2 rounded-lg text-black shadow-lg";
      containerRef.current.appendChild(el);

      gsap.fromTo(el, { scale: 0, opacity: 0 }, { scale: 1.2, opacity: 1, duration: 0.5, ease: "back.out(1.7)" });
      gsap.to(el, { y: -50, opacity: 0, duration: 1.2, delay: 1, onComplete: () => el.remove() });

      setAchievementTrigger(null);
    }
  }, [achievementTrigger]);

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col items-center gap-6 p-6 relative overflow-hidden">
      <Navbar
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
        coins={coins}
        incomePerSec={Math.round(effectiveIncomePerSec)}
        onReset={resetGame}
        achievements={achievements}
        showAchievements={showAchievements}
        toggleAchievements={() => setShowAchievements((prev) => !prev)}
        ownedUpgrades={ownedUpgrades}
        coinsRef={coinCounterRef} // Pass for flying coin target
      />

      <Shop
        darkMode={darkMode}
        coins={coins}
        setCoins={setCoins}
        setIncomePerSec={setIncomePerSec}
        priceMultiplier={priceMultiplier}
        upgrades={upgrades}
        resetSignal={resetSignal}
        ownedUpgrades={ownedUpgrades}
        setOwnedUpgrades={setOwnedUpgrades}
        addCoins={addCoins} // Animate purchases
      />

      {events.length > 0 && (
        <EventPopup className="event-popup" darkMode={darkMode} event={events[0]} setEvents={setEvents} />
      )}

      <Achievement
        darkMode={darkMode}
        coins={coins}
        incomePerSec={Math.round(effectiveIncomePerSec)}
        addCoins={addCoins}
        applyBuff={applyBuff}
        applyPermanent={applyPermanent}
        resetSignal={resetSignal}
        showList={showAchievements}
        setShowList={setShowAchievements}
      />

      <div className="relative w-full h-full">
        {popups.map((p) => (
          <CoinPopup key={p.id} {...p} remove={(id) => setPopups((prev) => prev.filter((pp) => pp.id !== id))} />
        ))}
      </div>
    </div>
  );
}

export default App;