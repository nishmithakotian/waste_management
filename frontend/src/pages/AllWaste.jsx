import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdLocationOn } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { ImSpinner8 } from "react-icons/im";
import Header from "../Components/Header";

const AllWaste = () => {
  const [wastes, setWastes] = useState([]);
  const [filteredWastes, setFilteredWastes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Waste types for filter dropdown
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

  // Status options for filter dropdown
  const statusOptions = ["Reported", "In Progress", "Cleaned"];

  // Fetch all waste data
  const fetchAllWaste = async () => {
    try {
      const { data } = await axios.get(
        "https://waste-management-0kpq.onrender.com/waste/all"
      );
      setWastes(data.wastes);
      setFilteredWastes(data.wastes); // Show all wastes by default
      setLoading(false);
    } catch (error) {
      console.error("Error fetching waste data:", error);
      setLoading(false);
    }
  };

  // Apply filters based on search, type, and status
  const applyFilters = () => {
    let filtered = wastes;

    if (search) {
      filtered = filtered.filter(
        (waste) =>
          waste.typeOfWaste.toLowerCase().includes(search.toLowerCase()) ||
          waste.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((waste) => waste.typeOfWaste === typeFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((waste) => waste.status === statusFilter);
    }

    setFilteredWastes(filtered);
  };

  // Reset filters and show all wastes
  const resetFilters = () => {
    setSearch("");
    setTypeFilter("");
    setStatusFilter("");
    setFilteredWastes(wastes); // Reset to show all wastes
  };

  useEffect(() => {
    fetchAllWaste();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, typeFilter, statusFilter]);

  return (
    <>
      {/* Navigation Bar */}
      <Header />

      {/* Filters Section */}
      <div className="p-4 md:p-6 bg-[#0A192F] flex flex-col items-center">
        <h1 className="text-xl md:text-3xl font-bold text-[#64FFDA] mb-4">
          Search Waste
        </h1>
        <div className="w-full max-w-4xl space-y-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by type or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border border-[#2C3E50] rounded-lg bg-[#112240] text-[#CCD6F6] focus:outline-none focus:ring-2 focus:ring-[#64FFDA]"
          />

          {/* Type Filter Dropdown */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full p-3 border border-[#2C3E50] rounded-lg bg-[#112240] text-[#CCD6F6] focus:outline-none focus:ring-2 focus:ring-[#64FFDA]"
          >
            <option value="">Filter by Type</option>
            {wasteTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-3 border border-[#2C3E50] rounded-lg bg-[#112240] text-[#CCD6F6] focus:outline-none focus:ring-2 focus:ring-[#64FFDA]"
          >
            <option value="">Filter by Status</option>
            {statusOptions.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>

          {/* Reset Filters Button */}
          <button
            onClick={resetFilters}
            className="w-full p-3 bg-[#64FFDA] text-[#0A192F] rounded-lg hover:bg-[#52D1C2] transition duration-300 font-semibold"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-[80vh] bg-[#0A192F]">
          <ImSpinner8 size={50} color="#64FFDA" className="animate-spin" />
        </div>
      ) : (
        <div className="p-4 md:p-6 bg-[#0A192F] h-screen">
          <h1 className="text-lg md:text-2xl font-bold text-[#64FFDA] mb-6">
            All Waste
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredWastes.length > 0 ? (
              filteredWastes.map((waste) => (
                <div
                  key={waste._id}
                  className="bg-[#1A2A4F] rounded-lg shadow-lg p-4 border border-[#2C3E50] w-full md:w-[400px] h-auto"
                >
                  {waste.image && (
                    <img
                      src={waste.image}
                      alt={waste.typeOfWaste}
                      className="h-[150px] md:h-[200px] w-full object-cover rounded-md mb-4"
                    />
                  )}
                  <h2 className="text-lg md:text-xl font-bold text-[#64FFDA] mb-2">
                    {waste.typeOfWaste}
                  </h2>
                  <p className="text-sm text-[#CCD6F6]">
                    <strong>Location:</strong> {waste.location}
                  </p>
                  <p className="text-sm text-[#CCD6F6]">
                    <strong>Contact:</strong> {waste.contactNumber}
                  </p>
                  <p className="text-sm text-[#CCD6F6]">
                    <strong>Status:</strong> {waste.status}
                  </p>
                  <p className="text-sm text-[#CCD6F6]">
                    <strong>Description:</strong>{" "}
                    {waste.description ? waste.description : "N/A"}
                  </p>
                  <div className="flex justify-end items-center gap-4 mt-4">
                    <MdLocationOn
                      size={30}
                      className="cursor-pointer text-[#CCD6F6] hover:text-[#64FFDA]"
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
                      className="cursor-pointer text-[#CCD6F6] hover:text-[#64FFDA]"
                      onClick={() =>
                        window.open(`tel:${waste.contactNumber}`, "_self")
                      }
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#CCD6F6] text-center col-span-full">
                No waste found matching your filters.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AllWaste;
