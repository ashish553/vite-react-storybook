import React, { useState, useRef, useEffect, useCallback } from "react";
import "./HeaderNew.scss";
import LocationDropdown from "./LocationDropdown";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Store the previously focused element before opening the menu
  const handleMenuToggle = useCallback(() => {
    if (!menuOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
    setMenuOpen(!menuOpen);
  }, [menuOpen]);

  const handleCloseMenu = useCallback(() => {
    setMenuOpen(false);
    // Return focus to the toggle button when closing
    if (menuToggleRef.current) {
      menuToggleRef.current.focus();
    }
  }, []);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        handleCloseMenu();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [menuOpen, handleCloseMenu]);

  // Focus management when menu opens
  useEffect(() => {
    if (menuOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [menuOpen]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!menuOpen) return;

    const menu = menuRef.current;
    if (!menu) return;

    const focusableSelectors = 
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])';
    
    const getFocusableElements = () => {
      return Array.from(menu.querySelectorAll<HTMLElement>(focusableSelectors));
    };

    const firstElement = getFocusableElements()[0];
    const lastElement = getFocusableElements().pop();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      // If Shift+Tab on first element, move to last
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
      // If Tab on last element, move to first
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    menu.addEventListener("keydown", handleKeyDown);
    return () => menu.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <header className="header" role="banner">
      {/* Skip Link for Keyboard Users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Top Bar */}
      <div className="topbar" role="navigation" aria-label="Utility navigation">
        <div className="topbar-left" role="tablist" aria-label="Customer type selection">
          <button
            className="tab active"
            role="tab"
            aria-selected="true"
            aria-controls="residential-panel"
          >
            Residential
          </button>
          <button
            className="tab"
            role="tab"
            aria-selected="false"
            aria-controls="business-panel"
          >
            Business
          </button>
          <button
            className="tab"
            role="tab"
            aria-selected="false"
            aria-controls="roi-panel"
          >
            ROI ▾
          </button>
        </div>

        <div className="topbar-right">
          <LocationDropdown />
          <button
            className="lang"
            aria-label="Select language, currently Gaeilge"
          >
            📘 Gaeilge
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="navbar" role="navigation" aria-label="Main navigation">
        <div className="logo" role="img" aria-label="Company Logo">
          Company Logo
        </div>

        {/* Desktop Menu */}
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#price-plans" className="nav-link">
            Price plans
          </a>
          <a href="#products" className="nav-link">
            Products
          </a>
          <a href="#my-account" className="nav-link">
            My account
          </a>
          <a href="#help" className="nav-link">
            Help
          </a>
          <a href="#about-us" className="nav-link">
            About us
          </a>
        </nav>

        {/* Icons */}
        <div className="icons" role="group" aria-label="Utility actions">
          <button
            className="icon-btn"
            aria-label="Search"
            title="Search"
          >
            🔍
          </button>
          <button
            className="icon-btn"
            aria-label="My account"
            title="My account"
          >
            👤
          </button>
          <button
            ref={menuToggleRef}
            className="icon-btn mobile-only"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            title={menuOpen ? "Close menu" : "Open menu"}
            onClick={handleMenuToggle}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        hidden={!menuOpen}
      >
        <div className="mobile-header">
          <span className="logo" aria-hidden="true">
            Company Logo
          </span>
          <button
            ref={closeButtonRef}
            onClick={handleCloseMenu}
            aria-label="Close mobile menu"
            title="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="mobile-links" aria-label="Mobile navigation">
          <a
            href="#price-plans"
            className="nav-link"
            onClick={handleLinkClick}
          >
            Price plans
          </a>
          <a
            href="#products"
            className="nav-link"
            onClick={handleLinkClick}
          >
            Products
          </a>
          <a
            href="#my-account"
            className="nav-link"
            onClick={handleLinkClick}
          >
            My account
          </a>
          <a
            href="#help"
            className="nav-link"
            onClick={handleLinkClick}
          >
            Help
          </a>
          <a
            href="#about-us"
            className="nav-link"
            onClick={handleLinkClick}
          >
            About us
          </a>
        </nav>
      </div>

      {/* Overlay for mobile menu */}
      {menuOpen && (
        <div
          className="mobile-overlay"
          onClick={handleCloseMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
};

export default Header;