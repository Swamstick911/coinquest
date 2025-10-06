import React, { useEffect } from "react";

const EventToast = ({ event, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(oneClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-5 right-5 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg animate-slideIn">
            ⚡ {event.text}
        </div>
    );
};

export default EventToast;