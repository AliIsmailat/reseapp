import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <>
      {/* <header className="bg-white shadow-md"> */}
      <header className="bg-gradient-to-r from-indigo-500/80 to-cyan-500/80 backdrop-blur-md text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col justify-center items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-white mb-2 sm:mb-0 self-center sm:self-auto"
          >
            RESEAPP
          </Link>
        </div>
      </header>
    </>
  );
};

export default Header;
