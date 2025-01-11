import React, { useState } from "react";
import axios from "axios"; // Import Axios
import bg from "../assets/bg.png";
import { Link, useNavigate } from "react-router-dom";
import { ImSpinner8 } from "react-icons/im";

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
        "https://waste-management-0kpq.onrender.com/user/register",
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
    <div className="flex flex-col lg:flex-row justify-center items-center h-screen w-full px-4 lg:px-0">
      {/* Background image (hidden on mobile) */}
      <img
        className="hidden lg:block w-full lg:w-[45vw] mb-6 lg:mb-0"
        src={bg}
        alt="Background"
      />

      {/* Sign Up Form Box */}
      <div className="bg-slate-100 shadow-xl w-full max-w-[500px] rounded-[15px] flex flex-col justify-center items-center p-6 lg:p-8">
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-700 mb-6 lg:mb-8">
          Sign Up
        </h2>

        <form onSubmit={handleSignUp} className="w-full flex flex-col">
          {/* Name Input */}
          <div className="mb-4 lg:mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>

          {/* Email Input */}
          <div className="mb-4 lg:mb-6">
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
          <div className="mb-4 lg:mb-6">
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

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full lg:w-[200px] bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 mb-4 self-center"
          >
            {loading ? (
              <ImSpinner8
                size={30}
                className="place-self-center animate-spin"
              />
            ) : (
              "SignUp"
            )}
          </button>

          {/* Sign Up Text */}
          <p className="text-center text-gray-600 text-sm lg:text-lg">
            Already have an account?{" "}
            <Link to="/" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
