import { FaSearch } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { LuAlignJustify } from "react-icons/lu";
import logo from "../../assets/logo.png";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img 
          src={logo} 
          alt="STACK TEXTPRO" 
          style={{
            width:"25px",
            height:"25px"
          }}/>
          
          <h1 className="font-bold text-2xl flex-wrap">
            <span className="text-slate-500">STACK</span>
            <span className="text-slate-700">  TEXTPRO</span>
          </h1>
        </Link>
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <span className="sr-only">Open main menu</span>
          <LuAlignJustify className="w-5 h-5" />
        </button>
        <div
          className={`w-full ${
            menuOpen ? "block md:hidden" : "hidden md:block"
          } md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <Link
              to="/"
              onClick={handleLinkClick}
              className={`block py-2 px-3 rounded md:bg-transparent md:p-0 ${
                location.pathname === "/"
                  ? "text-blue-700 dark:text-white"
                  : "text-gray-900 dark:text-gray-400 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              }`}
              aria-current="page"
            >
              Home
            </Link>
            {currentUser && (
              <Link
                to="/posts"
                onClick={handleLinkClick}
                className={`block py-2 px-3 rounded md:bg-transparent md:p-0 ${
                  location.pathname === "/posts"
                    ? "text-blue-700 dark:text-white"
                    : "text-gray-900 dark:text-gray-400 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                }`}
              >
                Posts
              </Link>
            )}
            {currentUser && (
              <Link
                to="/feed"
                onClick={handleLinkClick}
                className={`block py-2 px-3 rounded md:bg-transparent md:p-0 ${
                  location.pathname === "/feed"
                    ? "text-blue-700 dark:text-white"
                    : "text-gray-900 dark:text-gray-400 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                }`}
              >
                Feed
              </Link>
            )}
            {currentUser && (
              <Link
                to="/user-posts"
                onClick={handleLinkClick}
                className={`block py-2 px-3 rounded md:bg-transparent md:p-0 ${
                  location.pathname === "/user-posts"
                    ? "text-blue-700 dark:text-white"
                    : "text-gray-900 dark:text-gray-400 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                }`}
              >
                MyPosts
              </Link>
            )}

            <Link
              to="/about"
              onClick={handleLinkClick}
              className={`block py-2 px-3 rounded md:bg-transparent md:p-0 ${
                location.pathname === "/about"
                  ? "text-blue-700 dark:text-white"
                  : "text-gray-900 dark:text-gray-400 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              }`}
            >
              About
            </Link>
            <Link to="/profile" onClick={handleLinkClick}>
              {currentUser ? (
                <img
                  className="rounded-full h-7 w-7 object-cover"
                  src={currentUser.avatar}
                  alt="profile"
                />
              ) : (
                <span
                  className={`block py-2 px-3 rounded md:bg-transparent md:p-0 ${
                    location.pathname === "/profile"
                      ? "text-blue-700 dark:text-white"
                      : "text-gray-900 dark:text-gray-400 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  }`}
                >
                  Sign in
                </span>
              )}
            </Link>
          </ul>
        </div>
      </div>
    </nav>
  );
}
