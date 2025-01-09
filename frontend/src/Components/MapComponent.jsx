import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import { IoIosCall } from "react-icons/io";

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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          See Govt. Offices
        </button>
      )}
      {showModal && (
        <div className="bg-white p-4 rounded-lg overflow-auto min-h-screen w-full sm:w-3/4 md:w-2/3 mx-auto">
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => setShowModal(false)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded"
            >
              Close
            </button>
            <div className="flex flex-wrap justify-center gap-6 mt-6">
              {pharmacies.map((item, index) => (
                <div
                  key={index}
                  className="bg-white shadow-xl p-4 rounded-lg flex flex-col items-center w-full sm:w-60 md:w-72"
                >
                  <img
                    className="h-40 w-full object-cover rounded-lg"
                    src="https://img.freepik.com/premium-vector/shopping-store-cartoon_18591-44033.jpg"
                    alt="Store"
                  />
                  <h1 className="mt-3 text-center font-bold">
                    {item.name || "Unknown"}
                  </h1>
                  <p className="text-center text-sm mt-2">
                    Address: {item.address || "Not available"}
                  </p>
                  <p className="text-center text-sm">
                    Distance: {item.distance || 0} meters
                  </p>
                  <p className="text-center text-sm">
                    Contact: {item.phone_number || "Not available"}
                  </p>
                  {item.phone_number && (
                    <button
                      onClick={() =>
                        (window.location.href = `tel:${item.phone_number}`)
                      }
                      className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded mt-3 flex items-center justify-center gap-2"
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
      )}
    </>
  );
}

export default MapComponent;
