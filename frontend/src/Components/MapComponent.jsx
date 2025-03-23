import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import { IoIosCall, IoMdClose } from "react-icons/io";
import { FaMapMarkerAlt } from "react-icons/fa";

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapComponent({ location }) {
  const [pharmacies, setPharmacies] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPharmacies();
  }, [location]);

  const fetchPharmacies = async () => {
    const options = {
      method: "GET",
      url: "https://trueway-places.p.rapidapi.com/FindPlacesNearby",
      params: {
        location: `${location.latitude},${location.longitude}`,
        type: "government_office",
        radius: "1000",
        language: "en",
      },
      headers: {
        "X-RapidAPI-Key": "a8e25abea7msh8465279dfb74285p1645c5jsn70922a7ec0cf",
        "X-RapidAPI-Host": "trueway-places.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      setPharmacies(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {showModal ? null : (
        <MapContainer
          center={[location.latitude, location.longitude] || [51.505, -0.09]}
          zoom={13}
          style={{
            height: "60vh",
            width: "90%",
            borderRadius: "0.5rem",
            maxWidth: "800px",
            zIndex: "1",
            position: "relative",
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <>
            <Marker
              position={[location.latitude, location.longitude]}
              icon={redIcon}
            >
              <Popup>Your current location.</Popup>
            </Marker>
            {pharmacies.map((pharmacy, index) => (
              <Marker
                key={index}
                position={[pharmacy.location.lat, pharmacy.location.lng]}
                icon={redIcon}
              >
                <Popup>{pharmacy.name}</Popup>
              </Marker>
            ))}
          </>
        </MapContainer>
      )}
      {showModal ? null : (
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#64FFDA] hover:bg-[#52D1C2] text-[#0A192F] font-bold py-2 px-4 rounded mt-4 transition duration-300"
        >
          See Govt. Offices
        </button>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A2A4F] rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-[#CCD6F6] hover:text-[#64FFDA] transition duration-300"
            >
              <IoMdClose size={24} />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-[#64FFDA] mb-6">
                Nearby Govt. Offices
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pharmacies.map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#112240] p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <FaMapMarkerAlt className="text-[#64FFDA]" size={20} />
                      <h1 className="text-lg font-semibold text-[#CCD6F6]">
                        {item.name || "Unknown"}
                      </h1>
                    </div>
                    <p className="text-sm text-[#8892B0]">
                      <strong>Address:</strong>{" "}
                      {item.address || "Not available"}
                    </p>
                    <p className="text-sm text-[#8892B0]">
                      <strong>Distance:</strong> {item.distance || 0} meters
                    </p>
                    <p className="text-sm text-[#8892B0]">
                      <strong>Contact:</strong>{" "}
                      {item.phone_number || "Not available"}
                    </p>
                    {item.phone_number && (
                      <button
                        onClick={() =>
                          (window.location.href = `tel:${item.phone_number}`)
                        }
                        className="bg-[#64FFDA] hover:bg-[#52D1C2] text-[#0A192F] font-bold py-2 px-4 rounded mt-4 flex items-center justify-center gap-2 transition duration-300"
                      >
                        <IoIosCall size={20} />
                        Call
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MapComponent;
