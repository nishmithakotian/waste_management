import React, { useEffect, useState } from "react";
import MapComponent from "../Components/MapComponent.jsx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Header from "../Components/Header.jsx";

const Map = () => {
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [show, setShow] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setShow(true);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported.");
    }
  }, []);

  return (
    <>
      <Header />
      <div className="h-screen w-full flex flex-col items-center px-4 bg-[#0A192F]">
        <h1 className="font-bold m-5 text-3xl sm:text-5xl text-[#64FFDA] text-center">
          Nearby Offices
        </h1>
        {show ? (
          <MapComponent location={location} />
        ) : (
          <div className="flex justify-center items-center h-full">
            <AiOutlineLoading3Quarters
              className="animate-spin text-[#64FFDA]"
              size={50}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Map;
