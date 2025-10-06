import { useEffect } from "react";

export const useCoinIncome = (coins, setCoins, incomePerSec) => {
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins((prev) => Math.round(prev + incomePerSec));
    }, 1000);

    return () => clearInterval(interval);
  }, [coins, setCoins, incomePerSec]);
};
