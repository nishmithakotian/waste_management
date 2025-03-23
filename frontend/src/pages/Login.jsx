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
    <div className="flex justify-center items-center h-screen w-full px-4 bg-gradient-to-br from-[#0A192F] to-[#112240]">
      {/* Background image - Hidden in mobile view */}
      <img
        className="hidden lg:block w-full lg:w-[45vw] mb-6 lg:mb-0 opacity-50"
        src={bg}
        alt="Background"
      />

      {/* Login Form Box */}
      <div className="bg-[#1A2A4F] shadow-2xl w-full max-w-[500px] rounded-[15px] flex flex-col justify-center items-center p-8 border border-[#2C3E50]">
        <h2 className="text-3xl font-semibold text-[#64FFDA] mb-8">Login</h2>

        <form onSubmit={handleLogin} className="w-full flex flex-col">
          {/* Email Input */}
          <div className="w-full mb-6">
            <label className="block text-sm font-medium text-[#CCD6F6] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-[#2C3E50] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#64FFDA] focus:border-transparent bg-[#1A2A4F] text-[#CCD6F6] placeholder-[#8892B0]"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Input */}
          <div className="w-full mb-6">
            <label className="block text-sm font-medium text-[#CCD6F6] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-[#2C3E50] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#64FFDA] focus:border-transparent bg-[#1A2A4F] text-[#CCD6F6] placeholder-[#8892B0]"
              placeholder="Enter your password"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full lg:w-[200px] bg-[#64FFDA] text-[#0A192F] py-3 rounded-lg hover:bg-[#52D1C2] transition duration-300 mb-4 place-self-center font-semibold"
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
        <p className="text-lg text-[#CCD6F6]">
          Don't have an account?{" "}
          <Link to="/signUp" className="text-[#64FFDA] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
