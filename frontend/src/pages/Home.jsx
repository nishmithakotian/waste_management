import React from "react";
import bgVideo from "../assets/bgVideo.mp4"; // Replace with your video file
import Header from "../Components/Header";
import { Link } from 'react-router-dom';
import {
  AiOutlineCloudUpload,
  AiOutlineGlobal,
  AiOutlineInfoCircle,
  AiOutlineRobot,
  AiOutlineEnvironment,
} from "react-icons/ai";

const Home = () => {
  const featureCards = [
    {
      title: "Waste Classification",
      description:
        "Upload images of waste to classify them into recyclable, organic, or hazardous categories using AI.",
      icon: <AiOutlineCloudUpload className="text-6xl text-green-500 mb-4" />,
      route: "/post"
    },
    {
      title: "Cleaning Drive Locations",
      description:
        "Discover and join cleaning drives near you. Upload live locations for community-driven waste management.",
      icon: <AiOutlineEnvironment className="text-6xl text-blue-500 mb-4" />,
      route: "/map"
    },
    {
      title: "AI-Powered Solutions",
      description:
        "Get smart waste management solutions powered by Machine Learning and AI algorithms.",
      icon: <AiOutlineRobot className="text-6xl text-purple-500 mb-4" />,
      route: "/upload"
    },
    {
      title: "Community Posts",
      description:
        "Share and view posts about waste management initiatives, tips, and success stories.",
      icon: <AiOutlineGlobal className="text-6xl text-yellow-500 mb-4" />,
      route: "/allWaste"
    },
    {
      title: "Learn About Waste",
      description:
        "Access comprehensive resources to learn about proper waste disposal and recycling techniques.",
      icon: <AiOutlineInfoCircle className="text-6xl text-red-500 mb-4" />,
      route: "#"
    },
  ];

  return (
    <>
      <Header />
      <div className="overflow-hidden">
        {/* Landing Section */}
        <div className="relative h-screen w-full">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={bgVideo}
            autoPlay
            loop
            muted
          />
          {/* <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center">
            <h1 className="text-white text-6xl font-bold mb-4 text-center drop-shadow-lg">
              Welcome to WasteWise
            </h1>
            <p className="text-white text-lg mb-8 text-center px-4 drop-shadow-lg">
              Revolutionizing waste management with AI-powered classification
              and community-driven solutions.
            </p>
            <a
              href="/upload"
              className="px-6 py-3 bg-green-500 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-green-400 transition duration-300 animate-pulse"
            >
              Get Started
            </a>
          </div> */}
        </div>

        {/* Features Section */}
        <section className="py-16 bg-gray-100">
          <h2 className="text-4xl font-bold text-center mb-8">Our Features</h2>
          <div className="mx-auto flex justify-evenly items-center gap-10 flex-wrap px-4">
            {featureCards.map((feature, index) => (
              <Link to={feature.route} key={index} className="w-[350px]"> 
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center hover:scale-105 hover:opacity-75 cursor-pointer w-[350px]"
                >
                  {feature.icon}
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-center">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="h-[200px] bg-green-500">
          <div className="max-w-6xl mx-auto flex justify-center items-center flex-col text-center h-full">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Make a Difference?
            </h2>
            <a
              href="/upload"
              className="px-8 py-4 bg-white text-green-500 font-semibold text-lg rounded-lg shadow-lg hover:opacity-90 transition duration-300"
            >
              Join Us Today
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
