import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ImSpinner8 } from "react-icons/im";
import Header from "../Components/Header";

const Upload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
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
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error uploading the image:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      {/* Navigation Bar */}
      <Header />

      {/* Upload Section */}
      <div className="flex flex-col items-center justify-center mt-10 space-y-6 px-4 sm:px-6 md:px-10">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Waste Classification
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Upload an image to classify waste as biodegradable or
            non-biodegradable.
          </p>
        </div>

        {/* Styled File Upload Input */}
        <label
          htmlFor="imageUpload"
          className="w-48 sm:w-64 flex flex-col items-center justify-center p-4 sm:p-6 bg-blue-100 border-2 border-blue-400 rounded-lg cursor-pointer hover:bg-blue-200 transition duration-300 ease-in-out shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 sm:h-10 sm:w-10 mb-2 sm:mb-3 text-blue-500"
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
          <span className="text-sm sm:text-lg font-medium text-blue-600">
            Click to Upload Image
          </span>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>

        {/* Image Preview */}
        {selectedImage && (
          <div className="mt-4 w-40 h-40 sm:w-64 sm:h-64 border-2 border-dashed border-blue-400 rounded-lg overflow-hidden shadow-lg">
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
          className="px-4 sm:px-6 py-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition duration-300 ease-in-out text-sm sm:text-base"
        >
          {loading ? (
            <ImSpinner8 size={20} className="animate-spin" />
          ) : (
            "Classify Waste"
          )}
        </button>
      </div>

      {/* Modal for Prediction */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 sm:p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Prediction
              </h2>
              <button
                onClick={closeModal}
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
                  className="w-full h-40 sm:h-48 object-cover rounded-lg shadow-lg"
                />
              )}
              <div className="mt-4 text-center">
                <p className="text-sm sm:text-base text-gray-700">
                  <strong>Type:</strong>{" "}
                  {prediction && Object.keys(prediction)[0]}
                </p>
                <p className="text-sm sm:text-base text-gray-700">
                  <strong>Category:</strong>{" "}
                  {prediction && Object.values(prediction)[0]}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Upload;
