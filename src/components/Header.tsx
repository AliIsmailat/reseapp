import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 mb-2 sm:mb-0 self-center sm:self-auto"
        >
          Reseapp
        </Link>

        <nav>
          <ul className="flex flex-col items-center sm:flex-row sm:space-x-6">
            <li>
              <Link to="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/countries"
                className="text-gray-700 hover:text-blue-600"
              >
                Countries
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-700 hover:text-blue-600">
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
