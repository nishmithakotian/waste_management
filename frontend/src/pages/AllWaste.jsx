import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";
import { IoCallOutline } from "react-icons/io5";
import { ImSpinner8 } from "react-icons/im";
import Header from "../Components/Header";

const AllWaste = () => {
  const [wastes, setWastes] = useState([]);
  const [filteredWastes, setFilteredWastes] = useState([]);
  const [loading, setLoading] = useState(true); // Initially set loading to true
  const [search, setSearch] = useState("");

  // Fetch all waste data
  const fetchAllWaste = async () => {
    try {
      const { data } = await axios.get(
        "https://waste-management-0kpq.onrender.com/waste/all"
      );
      console.log(data);
      setWastes(data.wastes); // Assume data is an array of waste objects
      setFilteredWastes(data.wastes); // Initially show all wastes
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error("Error fetching waste data:", error);
      setLoading(false); // Ensure loading is false in case of error
    }
  };

  // Filter wastes based on search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);

    const filtered = wastes.filter(
      (waste) =>
        waste.typeOfWaste.toLowerCase().includes(query) ||
        waste.location.toLowerCase().includes(query)
    );
    setFilteredWastes(filtered);
  };

  useEffect(() => {
    fetchAllWaste();
  }, []);

  return (
    <>
      {/* Navigation Bar */}
      <Header />

      {/* Search Bar */}
      <div className="p-4 md:p-6 bg-gray-100 flex flex-col items-center">
        <h1 className="text-xl md:text-3xl font-bold text-blue-600 mb-2 md:mb-4">
          Search Waste
        </h1>
        <input
          type="text"
          placeholder="Search by name or location..."
          value={search}
          onChange={handleSearch}
          className="w-full max-w-sm md:max-w-lg p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        // Show spinner when loading
        <div className="flex justify-center items-center h-[80vh]">
          <ImSpinner8
            size={50}
            md:size={100}
            color="blue"
            className="animate-spin"
          />
        </div>
      ) : (
        <div className="p-4 md:p-6">
          <h1 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">
            All Waste
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredWastes.length > 0 ? (
              filteredWastes.map((waste) => (
                <div
                  key={waste._id}
                  className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 w-full md:w-[400px] h-auto md:h-[400px]"
                >
                  {waste.image && (
                    <img
                      src={waste.image}
                      alt={waste.typeOfWaste}
                      className="h-[150px] md:h-[200px] w-full object-cover rounded-md mb-2 md:mb-4"
                    />
                  )}
                  <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2">
                    {waste.typeOfWaste}
                  </h2>
                  <p className="text-sm md:text-gray-600">
                    <strong>Location:</strong> {waste.location}
                  </p>
                  <p className="text-sm md:text-gray-600">
                    <strong>Contact:</strong> {waste.contactNumber}
                  </p>
                  <p className="text-sm md:text-gray-600">
                    <strong>Description:</strong>{" "}
                    {waste.description ? waste.description : "N/A"}
                  </p>
                  <div className="flex justify-end items-center gap-3 md:gap-5 mt-3">
                    <MdLocationOn
                      size={30}
                      md:size={40}
                      className="cursor-pointer hover:text-green-400 text-black"
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps?q=${encodeURIComponent(
                            waste.location
                          )}`,
                          "_blank"
                        )
                      }
                    />
                    <IoCallOutline
                      size={30}
                      md:size={40}
                      className="cursor-pointer hover:text-green-400 text-black"
                      onClick={() =>
                        window.open(`tel:${waste.contactNumber}`, "_self")
                      }
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No waste found matching your search.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AllWaste;
