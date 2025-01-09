import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const PricePred = () => {
  const [formData, setFormData] = useState({
    pop: 100000,
    msw: 50000,
    msw_so: 30000,
    msw_un: 20000,
    sor: 0.6,
    pden: 500,
    gdp: 35000,
    wage: 30000,
    geo: 2,
    urb: 2,
    finance: 3000000,
    s_wteregio: 0.3,
    s_landfill: 0.2,
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/predict/cost/",
        formData
      );
      setPrediction(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred.");
      setPrediction(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-pink-500 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white/30 backdrop-blur-md shadow-md text-black py-4">
        <div className="container mx-auto flex justify-around items-center text-lg font-semibold">
          <Link to="/home" className="hover:text-blue-500 transition">
            Home
          </Link>
          <Link to="/post" className="hover:text-blue-500 transition">
            Post
          </Link>
          <Link to="/allWaste" className="hover:text-blue-500 transition">
            All Waste
          </Link>
          <Link to="/pricePred" className="text-blue-700 font-bold">
            Price Pred
          </Link>
          <Link to="/municipal" className="hover:text-blue-500 transition">
            MSP
          </Link>
          <Link to="/map" className="hover:text-blue-500 transition">
            Map
          </Link>
          <Link to="/" className="hover:text-blue-500 transition">
            LogOut
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto py-10 px-5">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Municipal Cost Prediction
        </h1>
        <p className="text-center mb-8">
          Fill out the form below to predict the total cost of municipal waste
          management.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white text-black p-8 rounded-lg shadow-lg max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(formData).map((key) => (
              <div key={key} className="flex flex-col">
                <label htmlFor={key} className="font-semibold mb-1 capitalize">
                  {key.replace(/_/g, " ")}
                </label>
                <input
                  type="number"
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-400"
                  required
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="mt-6 bg-blue-500 hover:bg-blue-600 transition text-white py-2 px-4 rounded-lg w-full"
          >
            Predict Cost
          </button>
        </form>

        {prediction && (
          <div className="mt-10 bg-green-500 text-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Prediction Results</h2>
            <p>
              <strong>Predicted Cost:</strong> €
              {prediction.predicted_cost_eur.toFixed(2)}
            </p>
            <p>
              <strong>Cost per Capita:</strong> €
              {prediction.metadata.cost_per_capita.toFixed(2)}
            </p>
            <p>
              <strong>Cost per Ton:</strong> €
              {prediction.metadata.cost_per_ton.toFixed(2)}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-10 bg-red-500 text-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-10 py-4 text-center text-sm text-white">
        &copy; {new Date().getFullYear()} Municipal Cost Prediction. All rights
        reserved.
      </footer>
    </div>
  );
};

export default PricePred;
