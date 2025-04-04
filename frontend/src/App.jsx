
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Post from "./pages/Post";
import Map from "./pages/Map";
import AllWaste from "./pages/AllWaste";
import PricePred from "./pages/PricePred";
import MunicipalSolidWaste from "./pages/MunicipalSolidWaste";
import Upload from "./pages/Upload";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/post" element={<Post />} />
        <Route path="/map" element={<Map />} />
        <Route path="/allWaste" element={<AllWaste />} />
        <Route path="/pricePred" element={<PricePred />} />
        <Route path="/municipal" element={<MunicipalSolidWaste />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
