import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope, FaUser, FaSpotify } from "react-icons/fa";
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !username || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await axiosInstance.post('/auth/register', {
        email,
        username,
        password,
      });

      localStorage.setItem('user', JSON.stringify(response.data));

      toast.success('Sign up successful! Redirecting to login...', {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Error signing up:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary flex justify-center items-center p-4">
      <div className="w-full max-w-lg bg-secondary p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl sm:text-4xl text-center font-goldman mb-6">Sign Up to Kafka</h1>

        {error && (
          <div className="bg-red-500 text-white text-center py-2 mb-4 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm sm:text-base font-semibold">
              Email
            </label>
            <div className="flex items-center mt-2">
              <FaEnvelope className="text-primary mr-2" />
              <input
                type="email"
                id="email"
                className="w-full p-3 bg-transparent border-b-2 border-primary text-primary focus:outline-none"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm sm:text-base font-semibold">
              Username
            </label>
            <div className="flex items-center mt-2">
              <FaUser className="text-primary mr-2" />
              <input
                type="text"
                id="username"
                className="w-full p-3 bg-transparent border-b-2 border-primary text-primary focus:outline-none"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm sm:text-base font-semibold">
              Password
            </label>
            <div className="flex items-center mt-2">
              <FaLock className="text-primary mr-2" />
              <input
                type="password"
                id="password"
                className="w-full p-3 bg-transparent border-b-2 border-primary text-primary focus:outline-none"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-black rounded-lg hover:opacity-80 transition text-sm sm:text-base"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6">
          <a
            href="http://localhost:5000/login/spotify"
            className="flex items-center justify-center w-full py-3 bg-green-600 text-white rounded-lg hover:opacity-80 transition"
          >
            <FaSpotify className="mr-2" />
            Sign Up with Spotify
          </a>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm sm:text-base">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
