import React, { useEffect, useRef } from "react";
import gsap from "gsap";

function EventPopup({ darkMode, event, setEvents }) {
  const popupRef = useRef(null);

  useEffect(() => {
    if (popupRef.current) {
      // Slide in from top
      gsap.fromTo(
        popupRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      // Fade out after event duration
      const fadeOutTimer = setTimeout(() => {
        gsap.to(popupRef.current, {
          y: -80,
          opacity: 0,
          duration: 0.8,
          ease: "power3.in",
          onComplete: () => setEvents([]),
        });
      }, event.duration - 500); // start fade out just before event ends

      return () => clearTimeout(fadeOutTimer);
    }
  }, [event, setEvents]);

  return (
    <div
      ref={popupRef}
      className={`fixed top-6 px-6 py-3 rounded-xl shadow-lg text-lg font-semibold z-50 ${
        darkMode ? "bg-purple-800 text-white" : "bg-purple-200 text-gray-900"
      }`}
    >
      🎉 {event.name}: {event.effect}
    </div>
  );
}

export default EventPopup;
