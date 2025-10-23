// src/components/Header.tsx
import React, { useState } from 'react';

// Annahme: Navigationslinks
const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Generator', href: '/generator' },
  { name: 'How it Works', href: '/how-it-works' },
  { name: 'FAQ', href: '/faq' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="text-2xl font-extrabold text-primary-DEFAULT">
          GuitarSkillz<span className="text-dark-900">.com</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="font-medium text-dark-700 hover:text-primary-DEFAULT transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menü öffnen"
            aria-expanded={isMobileMenuOpen}
          >
            {/* Hamburger Icon */}
            <svg
              className="w-6 h-6 text-dark-900"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu (ausklappbar) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg pb-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block px-4 py-3 text-lg font-medium text-dark-700 hover:bg-light-100"
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}