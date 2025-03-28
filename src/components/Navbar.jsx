import React, { useEffect,useState,useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import { RiMenu4Fill , RiMenu5Fill ,RiCloseFill } from "react-icons/ri";
import { FaCompactDisc } from "react-icons/fa6";
import LofiPlayer from './LofiPlayer'; // Import LofiPlayer component
import { MdDarkMode, MdLightMode } from "react-icons/md"; // Import theme icons


const Navbar = () => {
  const { user, logout } = useAuth(); // Get user and logout from AuthContext
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = useRef(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");


  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false); // Close menu if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout(); // Clear user state and token
    navigate('/login'); // Redirect to login page
  };

  const handleMenu = () => {
    setMenuOpen(!menuOpen); // Toggle the mobile menu
  };
  useEffect(() => {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }, [theme]);
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };
  return (
    <nav className="navbar h-20 w-full flex items-center justify-between px-10 relative">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/" className="text-2xl">
          <img src={theme === "dark" ? "logo_light.svg" : "logo.svg"} alt="Logo" className="h-12 w-12 transition-colors duration-200 hover:brightness-60" />
        </Link>
      </div>

      {/* Hamburger icon (only visible on mobile) */}
      <div className="md:hidden md:flex items-center space-x-4 ">
          <LofiPlayer /> {/* 🎶 Lofi Audio Toggle */}
        </div>
        {menuOpen ? (
        <RiCloseFill
          onClick={handleMenu}
          className="h-8 w-8 text-primary cursor-pointer md:hidden"
        />
      ) : (
        <RiMenu4Fill
          onClick={handleMenu}
          className="h-8 w-8 text-primary cursor-pointer md:hidden"
        />
      )}

      {/* Mobile menu (visible when menuOpen is true) */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="flex flex-col space-y-4 absolute left-0 top-20 bg-background p-4 rounded-lg shadow-lg z-10 w-full"
        >
          <Link to="/" className="hover:text-pink-300 transition" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/post" className="hover:text-pink-300 transition" onClick={() => setMenuOpen(false)}>Add Post</Link>
          <Link to="/explore" className="hover:text-pink-300 transition" onClick={() => setMenuOpen(false)}>Explore</Link>
          <Link to="/movies" className="hover:text-pink-300 transition" onClick={() => setMenuOpen(false)}>Movies</Link>
          <Link to="/chat" className="hover:text-pink-300 transition" onClick={() => setMenuOpen(false)}>Therapist</Link>
        
          {user && (
            <Link to="/myposts" className="hover:text-pink-300 transition" onClick={() => setMenuOpen(false)}>My Posts</Link>
          )}
            <button onClick={toggleTheme} className=" cursor-pointer ml-4 p-2 rounded-full bg-secondary text-primary hover:brightness-75">
        {theme === "dark" ? <MdLightMode className="h-6 w-6" /> : <MdDarkMode className="h-6 w-6" />}
      </button>
          {user ? (
            <button
              onClick={() => { handleLogout(); setMenuOpen(false); }}
              className="text-lg text-background bg-primary py-1 px-3 cursor-pointer border rounded-sm transition-colors duration-200 hover:brightness-60"
            >
              Log out
            </button>
          ) : (
            <Link
              to="/login"
              className="text-lg text-background bg-primary py-1 px-3 border rounded-sm transition-colors duration-200 hover:brightness-60"
              onClick={() => setMenuOpen(false)}
            >
              Log in
            </Link>
          )}
        </div>
      )}

      {/* Desktop Menu (visible on larger screens) */}
      <div className="hidden md:flex items-center justify-center space-x-6 w-full">
        <Link to="/" className="text-lg">
          <img src={theme === "dark" ? "home.svg" : "home_light.svg"} alt="Home" className="h-8 w-8 transition-colors duration-200 hover:brightness-60 " />
        </Link>

        
        <Link to="/explore" className="text-lg">
          <img src={theme === "dark" ? "explore.svg" : "explore_light.svg"} alt="Explore" className="h-8 w-8 transition-colors duration-200 hover:brightness-60" />
        </Link>
        <Link to="/movies" className="text-lg">
          <img src={theme === "dark" ? "movie.svg" : "movie_light.svg"} alt="Explore" className="h-8 w-8 transition-colors duration-200 hover:brightness-60 " />
        </Link>
        <Link to="/post" className="text-lg">
          <img src={theme === "dark" ? "add.svg" : "add_light.svg"} alt="Add" className="h-8 w-8 transition-colors duration-200 hover:brightness-60 " />
        </Link>
        <Link to="/chat" className="text-lg">
          <img src={theme === "dark" ? "therapist.svg" : "therapist_light.svg"} alt="Therapist" className="h-8 w-8 transition-colors duration-200 hover:brightness-60 " />
        </Link>
      </div>

      {/* Desktop Authentication links */}
      <div className="hidden md:flex items-center space-x-4">
      <button onClick={toggleTheme} className=" cursor-pointer ml-4 p-2 rounded-full bg-secondary text-primary hover:brightness-75">
        {theme === "dark" ? <MdLightMode className="h-6 w-6" /> : <MdDarkMode className="h-6 w-6" />}
      </button>
        {/* <Link to="/explore" className="hover:text-pink-300 transition">Explore</Link> */}
        {user && (
          <Link to="/myposts" className="hover:text-pink-300 transition">My Posts</Link>
        )}
        {user ? (
          <button
            onClick={() => { handleLogout(); }}
            className=" text-lg text-background bg-primary py-1 px-3 cursor-pointer border rounded-sm transition-colors duration-200 hover:bg-pink-300"
          >
            Log out
          </button>
        ) : (
          <Link
            to="/login"
            className="text-lg text-background bg-primary py-1 px-3 border rounded-sm transition-colors duration-200 hover:bg-pink-300"
          >
            Log in
          </Link>
        )}
 
      
        <div className="hidden md:flex items-center space-x-4">
          <LofiPlayer /> {/* 🎶 Lofi Audio Toggle */}
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
