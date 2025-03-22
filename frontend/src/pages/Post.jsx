import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete, MdOutlineChangeCircle } from "react-icons/md";
import { ImSpinner8 } from "react-icons/im";
import Header from "../Components/Header";

const Post = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editWasteId, setEditWasteId] = useState(null);
  const [formData, setFormData] = useState({
    image: null,
    type: "",
    latitude: "",
    longitude: "",
    contact: "",
    description: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [wastes, setWastes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(true);

  const user = JSON.parse(localStorage.getItem("User"));
  const userId = user?.user?._id;

  // Fetch user's current location (latitude and longitude)
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
          }));
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    if (showModal && !isEdit) {
      fetchLocation(); // Fetch location when modal opens for adding new waste
    }
  }, [showModal, isEdit]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const uploadToCloudinary = async (imageFile) => {
    const cloudinaryUrl =
      "https://api.cloudinary.com/v1_1/dgplustqn/image/upload";
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "pmcr8gua");

    try {
      const response = await axios.post(cloudinaryUrl, formData);
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw new Error("Cloudinary upload failed.");
    }
  };

  const handleSave = async () => {
    if (
      !formData.type ||
      !formData.latitude ||
      !formData.longitude ||
      !formData.contact
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setIsUploading(true);

    try {
      let imageUrl = formData.image;
      if (formData.image instanceof File) {
        imageUrl = await uploadToCloudinary(formData.image);
      }

      const data = {
        userId,
        typeOfWaste: formData.type,
        latitude: formData.latitude,
        longitude: formData.longitude,
        contactNumber: formData.contact,
        description: formData.description,
        image: imageUrl,
        user: userId,
      };

      if (isEdit) {
        await axios.put(
          `https://waste-management-0kpq.onrender.com/waste/update/${editWasteId}`,
          data
        );
        alert("Waste updated successfully!");
      } else {
        await axios.post(
          "https://waste-management-0kpq.onrender.com/waste/add",
          data
        );
        alert("Waste added successfully!");
      }

      setShowModal(false);
      setIsEdit(false);
      setFormData({
        image: null,
        type: "",
        latitude: "",
        longitude: "",
        contact: "",
        description: "",
      });
      getUser();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save data. Please try again.");
    } finally {
      setIsUploading(false);
      setLoading(false);
    }
  };

  const getUser = async () => {
    try {
      setSpinner(true); // Show spinner while fetching data
      const { data } = await axios.get(
        `https://waste-management-0kpq.onrender.com/user/${userId}`
      );
      setWastes(data?.user?.wastes || []);
    } catch (error) {
      console.log(error);
    } finally {
      setSpinner(false); // Hide spinner after data is fetched
    }
  };

  const handleDel = async (wasteId) => {
    try {
      await axios.delete(
        `https://waste-management-0kpq.onrender.com/waste/delete/${wasteId}`
      );
      getUser();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (waste) => {
    setIsEdit(true);
    setEditWasteId(waste._id);
    setFormData({
      image: waste.image,
      type: waste.typeOfWaste,
      latitude: waste.latitude,
      longitude: waste.longitude,
      contact: waste.contactNumber,
      description: waste.description,
    });
    setShowModal(true);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <Header />
      <div className="flex justify-between items-center p-4 text-[20px] font-serif ">
        <button
          onClick={() => {
            setShowModal(true);
            setIsEdit(false);
            setFormData({
              image: null,
              type: "",
              latitude: "",
              longitude: "",
              contact: "",
              description: "",
            });
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Waste
        </button>
      </div>

      {/* Spinner while loading */}
      {spinner ? (
        <div className="flex justify-center items-center h-[80vh]">
          <ImSpinner8
            size={50}
            color="blue"
            className="animate-spin mt-[100px]"
          />
        </div>
      ) : (
        // Show content after data is loaded
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-6">
          {wastes.length === 0 ? (
            <div className="text-center text-xl font-bold">
              No posts uploaded.
            </div>
          ) : (
            wastes.map((waste) => (
              <div
                key={waste._id}
                className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 w-full sm:w-[400px] h-auto"
              >
                {waste.image && (
                  <img
                    src={waste.image}
                    alt={waste.typeOfWaste}
                    className="h-40 w-full object-cover rounded-md mb-4"
                  />
                )}
                <h3 className="text-lg font-bold">{waste.typeOfWaste}</h3>
                <p className="text-sm text-gray-700">
                  Latitude: {waste.latitude}
                </p>
                <p className="text-sm text-gray-700">
                  Longitude: {waste.longitude}
                </p>
                <p className="text-sm text-gray-700">
                  Contact: {waste.contactNumber}
                </p>
                {waste.description && (
                  <p className="text-sm text-gray-700 mt-2">
                    {waste.description}
                  </p>
                )}
                <div className="flex justify-end items-center gap-4 mt-4">
                  <MdDelete
                    size={30}
                    className="cursor-pointer hover:text-red-400 hover:scale-105"
                    onClick={() => handleDel(waste._id)}
                  />
                  <MdOutlineChangeCircle
                    size={30}
                    className="cursor-pointer hover:text-violet-400 hover:scale-105"
                    onClick={() => handleEdit(waste)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-[400px] mt-20 h-[400px] overflow-auto">
            <h2 className="text-2xl font-bold mb-4">
              {isEdit ? "Edit Waste" : "Add Waste"}
            </h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Upload Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full"
                />
                {formData.image && typeof formData.image === "string" && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-20 w-20 mt-2 rounded-md"
                  />
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Type of Waste
                </label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="e.g., Plastic, Metal"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Latitude</label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="Fetching latitude..."
                  className="w-full border p-2 rounded"
                  required
                  readOnly // Make the latitude field read-only
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Longitude
                </label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="Fetching longitude..."
                  className="w-full border p-2 rounded"
                  required
                  readOnly // Make the longitude field read-only
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Enter contact details"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add any additional details"
                  className="w-full border p-2 rounded"
                />
              </div>
            </form>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                disabled={isUploading}
              >
                {isUploading ? "Saving..." : isEdit ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Post;
