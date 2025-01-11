import React, { useState } from "react";
import axios from "axios";
import bg from "../assets/bg.png";
import { Link, useNavigate } from "react-router-dom";
import { ImSpinner8 } from "react-icons/im";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userCredentials = { email, password };

    try {
      const response = await axios.post(
        "https://waste-management-0kpq.onrender.com/user/login",
        userCredentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("User", JSON.stringify(response.data));
      setLoading(false);
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error.response.data);
      alert("Invalid user!!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full px-4">
      {/* Background image - Hidden in mobile view */}
      <img
        className="hidden lg:block w-full lg:w-[45vw] mb-6 lg:mb-0"
        src={bg}
        alt="Background"
      />

      {/* Login Form Box */}
      <div className="bg-slate-100 shadow-xl w-full max-w-[500px] rounded-[15px] flex flex-col justify-center items-center p-8">
        <h2 className="text-3xl font-semibold text-gray-700 mb-8">Login</h2>

        <form onSubmit={handleLogin} className="w-full flex flex-col">
          {/* Email Input */}
          <div className="w-full mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Input */}
          <div className="w-full mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full lg:w-[200px] bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 mb-4 place-self-center"
          >
            {loading ? (
              <ImSpinner8
                size={30}
                className="place-self-center animate-spin"
              />
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Sign Up Text */}
        <p className="text-lg text-gray-600">
          Don't have an account?{" "}
          <Link to="/signUp" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
