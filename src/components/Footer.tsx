import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col items-center md:flex-row md:justify-between md:items-center text-gray-600">
        <p className="text-sm mb-2 md:mb-0 text-center md:text-left"></p>

        <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-4">
          <a href="/privacy" className="text-sm hover:text-blue-600">
            Filler 1
          </a>
          <a href="/terms" className="text-sm hover:text-blue-600">
            Filler 2
          </a>
          <a href="/contact" className="text-sm hover:text-blue-600">
            Filler 3
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
