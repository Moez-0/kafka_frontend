import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope, FaSpotify } from "react-icons/fa";
import axiosInstance from '../api/axiosInstance'; 
import { toast } from 'react-toastify'; 
import { useAuth } from "../context/AuthContext"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      const token = response.data.token; 
      login(token); 

      toast.success("Successfully logged in!");
      navigate('/post'); 
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error("Error logging in:", err);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary flex justify-center items-center py-6">
      <div className="w-full max-w-sm sm:max-w-md bg-secondary p-6 sm:p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl sm:text-4xl text-center font-goldman mb-6">Login to Kafka</h1>

        {error && (
          <div className="bg-red-500 text-white text-center py-2 mb-4 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm sm:text-base font-semibold">
              Email or Username
            </label>
            <div className="flex items-center mt-2">
              <FaEnvelope className="text-primary mr-2" />
              <input
                type="email"
                id="email"
                className="w-full p-3 bg-transparent border-b-2 border-primary text-primary focus:outline-none"
                placeholder="Enter your email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-black rounded-lg hover:opacity-80 transition text-sm sm:text-base"
          >
            Login
          </button>
        </form>

        <div className="mt-6">
          <a
            href="https://kafka-backend-idwn.onrender.com/login/spotify"
            className="flex items-center justify-center w-full py-3 bg-green-600 text-white rounded-lg hover:opacity-80 transition"
          >
            <FaSpotify className="mr-2" />
            Login with Spotify
          </a>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm sm:text-base">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
