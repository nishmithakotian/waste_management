import React, { useState } from "react";
import axios from "axios"; // Import Axios
import bg from "../assets/bg.png";
import { Link, useNavigate } from "react-router-dom";
import { ImSpinner8 } from "react-icons/im";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; 

const SignUp = () => {
  // State for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    const userDetails = {
      name,
      email,
      password,
    };

    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/register`,
        userDetails,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      navigate("/");
      // Handle successful signup (e.g., redirect to login or dashboard)
    } catch (error) {
      console.error("Signup failed:", error.response.data);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center h-screen w-full px-4 lg:px-0 bg-gradient-to-br from-[#0A192F] to-[#112240]">
      {/* Background image (hidden on mobile) */}
      <img
        className="hidden lg:block w-full lg:w-[45vw] mb-6 lg:mb-0 opacity-50"
        src={bg}
        alt="Background"
      />

      {/* Sign Up Form Box */}
      <div className="bg-[#1A2A4F] shadow-2xl w-full max-w-[500px] rounded-[15px] flex flex-col justify-center items-center p-6 lg:p-8 border border-[#2C3E50]">
        <h2 className="text-2xl lg:text-3xl font-semibold text-[#64FFDA] mb-6 lg:mb-8">
          Sign Up
        </h2>

        <form onSubmit={handleSignUp} className="w-full flex flex-col">
          {/* Name Input */}
          <div className="mb-4 lg:mb-6">
            <label className="block text-sm font-medium text-[#CCD6F6] mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-[#2C3E50] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#64FFDA] focus:border-transparent bg-[#1A2A4F] text-[#CCD6F6] placeholder-[#8892B0]"
              placeholder="Enter your name"
            />
          </div>

          {/* Email Input */}
          <div className="mb-4 lg:mb-6">
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
          <div className="mb-4 lg:mb-6">
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

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full lg:w-[200px] bg-[#64FFDA] text-[#0A192F] py-3 rounded-lg hover:bg-[#52D1C2] transition duration-300 mb-4 self-center font-semibold"
          >
            {loading ? (
              <ImSpinner8
                size={30}
                className="place-self-center animate-spin"
              />
            ) : (
              "Sign Up"
            )}
          </button>

          {/* Sign Up Text */}
          <p className="text-center text-[#CCD6F6] text-sm lg:text-lg">
            Already have an account?{" "}
            <Link to="/" className="text-[#64FFDA] hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
