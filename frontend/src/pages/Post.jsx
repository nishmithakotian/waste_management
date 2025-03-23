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
    status: "Reported", // Default status
  });
  const [isUploading, setIsUploading] = useState(false);
  const [wastes, setWastes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(true);

  const user = JSON.parse(localStorage.getItem("User"));
  const userId = user?.user?._id;

  // Waste types for dropdown
  const wasteTypes = [
    "Organic Waste (food scraps, leaves)",
    "Plastic Waste (bottles, wrappers, containers)",
    "Glass Waste (broken glass, bottles, jars)",
    "Metal Waste (cans, aluminum, iron scraps)",
    "Paper Waste (newspapers, cardboard, books)",
    "Electronic Waste (E-Waste) (mobile phones, wires, batteries)",
    "Medical Waste (masks, syringes, gloves)",
    "Hazardous Waste (chemicals, paints, pesticides)",
    "Textile Waste (old clothes, fabric scraps)",
    "Construction Waste (bricks, cement, wood)",
  ];

  // Status options for dropdown
  const statusOptions = ["Reported", "In Progress", "Resolved"];

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
    if (!formData.type || !formData.contact) {
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
        status: formData.status, // Include status
        image: imageUrl,
        userID: userId,
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
        status: "Reported", // Reset status
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
      status: waste.status || "Reported", // Default to "Reported" if status is missing
    });
    setShowModal(true);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <Header />
      <div className="flex justify-between items-center p-4 text-[20px] font-serif bg-[#0A192F]">
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
              status: "Reported", // Reset status
            });
          }}
          className="bg-[#64FFDA] text-[#0A192F] px-4 py-2 rounded hover:bg-[#52D1C2] transition duration-300"
        >
          Add Waste
        </button>
      </div>

      {/* Spinner while loading */}
      {spinner ? (
        <div className="flex justify-center items-center h-[80vh] bg-[#0A192F]">
          <ImSpinner8
            size={50}
            color="#64FFDA"
            className="animate-spin mt-[100px]"
          />
        </div>
      ) : (
        // Show content after data is loaded
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-6 bg-[#0A192F]">
          {wastes.length === 0 ? (
            <div className="text-center text-xl font-bold text-[#CCD6F6] h-screen">
              No posts uploaded.
            </div>
          ) : (
            wastes.map((waste) => (
              <div
                key={waste._id}
                className="bg-[#1A2A4F] rounded-lg shadow-lg p-4 border border-[#2C3E50] w-full sm:w-[400px] h-auto"
              >
                {waste.image && (
                  <img
                    src={waste.image}
                    alt={waste.typeOfWaste}
                    className="h-40 w-full object-cover rounded-md mb-4"
                  />
                )}
                <h3 className="text-lg font-bold text-[#64FFDA]">
                  {waste.typeOfWaste}
                </h3>
                <p className="text-sm text-[#CCD6F6]">
                  <strong>Status:</strong> {waste.status}
                </p>
                <p className="text-sm text-[#CCD6F6]">
                  <strong>Contact:</strong> {waste.contactNumber}
                </p>
                {waste.description && (
                  <p className="text-sm text-[#CCD6F6] mt-2">
                    {waste.description}
                  </p>
                )}
                <div className="flex justify-end items-center gap-4 mt-4">
                  <MdDelete
                    size={30}
                    className="cursor-pointer text-[#CCD6F6] hover:text-red-400 hover:scale-105"
                    onClick={() => handleDel(waste._id)}
                  />
                  <MdOutlineChangeCircle
                    size={30}
                    className="cursor-pointer text-[#CCD6F6] hover:text-violet-400 hover:scale-105"
                    onClick={() => handleEdit(waste)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
          <div className="bg-[#1A2A4F] p-6 rounded-lg shadow-lg w-full sm:w-[500px] max-h-[90vh] overflow-auto">
            <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
              {isEdit ? "Edit Waste" : "Add Waste"}
            </h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-bold text-[#CCD6F6] mb-2">
                  Upload Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full text-[#CCD6F6]"
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
                <label className="block text-sm font-bold text-[#CCD6F6] mb-2">
                  Type of Waste
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border border-[#2C3E50] p-2 rounded bg-[#112240] text-[#CCD6F6]"
                  required
                >
                  <option value="">Select Waste Type</option>
                  {wasteTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-[#CCD6F6] mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-[#2C3E50] p-2 rounded bg-[#112240] text-[#CCD6F6]"
                  required
                >
                  {statusOptions.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-[#CCD6F6] mb-2">
                  Contact
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Enter contact details"
                  className="w-full border border-[#2C3E50] p-2 rounded bg-[#112240] text-[#CCD6F6]"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-[#CCD6F6] mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add any additional details"
                  className="w-full border border-[#2C3E50] p-2 rounded bg-[#112240] text-[#CCD6F6]"
                />
              </div>
            </form>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-[#2C3E50] text-[#CCD6F6] px-4 py-2 rounded hover:bg-[#1A2A4F] transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-[#64FFDA] text-[#0A192F] px-4 py-2 rounded hover:bg-[#52D1C2] transition duration-300"
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
