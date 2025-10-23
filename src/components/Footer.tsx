// src/components/Footer.tsx
import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 text-light-300 mt-16">
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="/faq" className="hover:text-white">FAQ</a>
          <a href="/how-it-works" className="hover:text-white">How it Works</a>
          <a href="#" className="hover:text-white">Privacy Policy</a>
        </div>
        <p>
          &copy; {currentYear} GuitarSkillz.com - Ein Open Source Projekt.
        </p>
      </div>
    </footer>
  );
}