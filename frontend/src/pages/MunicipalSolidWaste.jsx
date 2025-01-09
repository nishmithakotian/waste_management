import React, { useState } from "react";
import axios from "axios";

const MSWPrediction = () => {
  const [formData, setFormData] = useState({
    pop: "",
    area: "",
    pden: "",
    alt: "",
    urb: "",
    gdp: "",
    wage: "",
    finance: "",
    roads: "",
    proads: "",
    isle: false,
    sea: false,
    geo: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const fetchSampleData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/sample");
      setFormData(response.data.sample_medium_city);
    } catch (err) {
      setError("Failed to fetch sample data");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await axios.post(
        "http://localhost:8000/predict/",
        formData
      );
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">
        Municipal Solid Waste Prediction
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-lg"
      >
        {Object.keys(formData).map((key) => (
          <div key={key} className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor={key}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            {typeof formData[key] === "boolean" ? (
              <input
                type="checkbox"
                id={key}
                name={key}
                checked={formData[key]}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
            ) : (
              <input
                type="number"
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            )}
          </div>
        ))}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={fetchSampleData}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Use Sample Data
          </button>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? "Loading..." : "Predict"}
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {prediction && (
        <div className="mt-6 bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-lg">
          <h2 className="text-xl font-bold mb-4">Prediction Result</h2>
          <p>
            <strong>MSW (kg):</strong> {prediction.msw_kg}
          </p>
          <p>
            <strong>MSW (tonnes):</strong> {prediction.msw_tonnes}
          </p>
          <p>
            <strong>Confidence Metrics:</strong>
          </p>
          <ul className="list-disc list-inside">
            {Object.entries(prediction.confidence_metrics).map(
              ([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MSWPrediction;
