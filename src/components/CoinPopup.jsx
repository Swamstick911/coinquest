import React, { useEffect } from "react";

const CoinPopup = ({ id, x, y, amount, remove }) => {
    useEffect(() => {
        const timer = setTimeout(() => remove(id), 1000);
        return () => clearTimeout(timer);
    }, [id, remove]);

    return (
        <span
            className="absolute text-yellow-400 font-bold text-lg animate-popup"
            style={{ top: y, left: x }}
        >
            +{amount} 
        </span>
    );
};

export default CoinPopup;