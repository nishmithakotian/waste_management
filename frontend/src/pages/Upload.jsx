import React, { useState } from "react";
import axios from "axios";
import { ImSpinner8 } from "react-icons/im";
import Header from "../Components/Header";

const Upload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isPredictionModalOpen, setIsPredictionModalOpen] = useState(false);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/waste_classification",
        formData
      );
      setPrediction(response.data.prediction);
      setLoading(false);
      setIsPredictionModalOpen(true);
    } catch (error) {
      console.error("Error uploading the image:", error);
      setLoading(false);
    }
  };

  const closePredictionModal = () => {
    setIsPredictionModalOpen(false);
    setSelectedImage(null);
  };

  const openSolutionModal = () => {
    setIsSolutionModalOpen(true);
  };

  const closeSolutionModal = () => {
    setIsSolutionModalOpen(false);
  };

  return (
    <>
      {/* Navigation Bar */}
      <Header />

      {/* Upload Section */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Waste Classification
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Upload an image to classify waste as biodegradable or
            non-biodegradable.
          </p>
        </div>

        {/* Drag-and-Drop File Upload */}
        <div
          className="w-full max-w-md mt-6 p-8 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50 text-center cursor-pointer hover:bg-blue-100 transition duration-300 ease-in-out"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <label htmlFor="imageUpload" className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop an image here or{" "}
              <span className="text-blue-600 font-medium">click to upload</span>
              .
            </p>
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* Image Preview */}
        {selectedImage && (
          <div className="mt-6 w-48 h-48 sm:w-64 sm:h-64 border-2 border-dashed border-blue-400 rounded-lg overflow-hidden shadow-lg">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition duration-300 ease-in-out text-sm sm:text-base"
        >
          {loading ? (
            <ImSpinner8 size={20} className="animate-spin" />
          ) : (
            "Classify Waste"
          )}
        </button>
      </div>

      {/* Prediction Modal */}
      {isPredictionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Prediction</h2>
              <button
                onClick={closePredictionModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✖
              </button>
            </div>
            <div className="mt-4">
              {selectedImage && (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Uploaded"
                  className="w-full h-48 object-cover rounded-lg shadow-lg"
                />
              )}
              <div className="mt-4 text-center">
                <p className="text-base text-gray-700">
                  <strong>Type:</strong>{" "}
                  {prediction && Object.keys(prediction)[0]}
                </p>
                <p className="text-base text-gray-700">
                  <strong>Category:</strong>{" "}
                  {prediction && Object.values(prediction)[0].classification}
                </p>
              </div>
              <button
                onClick={openSolutionModal}
                className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
              >
                View Solution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Solution Modal */}
      {isSolutionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Solution</h2>
              <button
                onClick={closeSolutionModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✖
              </button>
            </div>
            <div className="mt-4">
              {prediction && (
                <div className="space-y-4">
                  <p className="text-base text-gray-700">
                    <strong>Disposal:</strong>{" "}
                    {
                      prediction[Object.keys(prediction)[0]].general_solution
                        .disposal
                    }
                  </p>
                  <p className="text-base text-gray-700">
                    <strong>Benefits:</strong>{" "}
                    {
                      prediction[Object.keys(prediction)[0]].general_solution
                        .benefits
                    }
                  </p>
                  <p className="text-base text-gray-700">
                    <strong>Tips:</strong>{" "}
                    {
                      prediction[Object.keys(prediction)[0]].general_solution
                        .tips
                    }
                  </p>
                  <p className="text-base text-gray-700">
                    <strong>Impact:</strong>{" "}
                    {
                      prediction[Object.keys(prediction)[0]].general_solution
                        .impact
                    }
                  </p>
                  <p className="text-base text-gray-700">
                    <strong>Alternatives:</strong>{" "}
                    {
                      prediction[Object.keys(prediction)[0]].general_solution
                        .alternatives
                    }
                  </p>
                  <p className="text-base text-gray-700">
                    <strong>Additional Resources:</strong>{" "}
                    {
                      prediction[Object.keys(prediction)[0]].general_solution
                        .additional_resources
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Upload;
