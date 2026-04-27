import React, { useState, useRef, useEffect } from "react";
import "./LocationDropdown.scss";

const LocationDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="location-dropdown" ref={ref}>
      <button
        className={`location-trigger ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
      >
        📍 Location
        <span className={`arrow ${open ? "rotate" : ""}`}>⌃</span>
      </button>

      {open && (
        <div className="dropdown-menu">
          <div className="dropdown-item">Location 1</div>
          <div className="dropdown-item active">Location 2</div>
        </div>
      )}
    </div>
  );
};

export default LocationDropdown;