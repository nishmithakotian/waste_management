import React from "react";
import { Link, useNavigate } from "react-router-dom";
import home from "../assets/home.png";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="max-h-screen relative">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between w-full px-4 md:px-0">
          {/* Image Section */}
          <div className="w-full md:w-auto order-1 md:order-none mb-6 md:mb-0 mt-[100px]">
            <img
              className="w-full md:w-auto h-auto md:h-[620px] object-cover"
              src={home}
              alt="Waste Management"
            />
          </div>

          {/* Text Content */}
          <div className="w-full md:w-auto text-center md:text-left mt-[100px] lg:mr-[50px] ">
            {/* Title */}
            <h1 className="text-blue-400 font-bold text-[30px] md:text-[60px] font-serif mt-[20px] md:mt-[150px]">
              Waste Management
            </h1>

            {/* Description */}
            <p className="text-blue-400 text-[14px] md:text-[20px] font-serif mt-4 md:mt-[50px] w-full md:w-[500px] mx-auto md:mx-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum
              quisquam nemo cum aperiam id consequuntur, quidem error similique
              consectetur voluptatibus aut doloremque eaque illum dicta
              architecto.
            </p>

            {/* Button */}
            <button
              onClick={() => navigate("/post")}
              className="border-blue-400 border-2 rounded-full px-4 py-2 text-[16px] md:text-[20px] font-bold font-serif text-blue-400 cursor-pointer mt-6 md:mt-[50px]"
            >
              Explore
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
