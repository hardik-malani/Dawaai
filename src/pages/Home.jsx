import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  const [language, setLanguage] = useState("english");

  const toggleLanguage = () => {
    setLanguage(language === "english" ? "hindi" : "english");
  };

  return (
    <div className="bg-[#E1F9F5] h-screen w-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="text-[#00856F] mx-10 flex gap-6 relative top-32 left-[75%] font-semibold">
        <Link to="/therapist">
          <span className="hover:text-[#559c90]">
            {language === "english" ? "Consult a Therapist" : "चिकित्सक से परामर्श करें"}
          </span>
        </Link>
        <Link to="/lab">
          <span className="hover:text-[#559c90]">
            {language === "english" ? "Get Medical Tests" : "चिकित्सा परीक्षण प्राप्त करें"}
          </span>
        </Link>
      </div>
      <div className="w-[40%] text-3xl lg:text-4xl text-[#00856F] relative top-[27%] left-[15%] font-semibold">
        <span>
          {language === "english"
            ? "Empowering you to thrive in wellness, because a healthy life is a journey worth embracing."
            : "आपको स्वास्थ्य में सफलता प्राप्त करने के लिए सशक्त करना, क्योंकि एक स्वस्थ जीवन एक यात्रा है जो गले लगाने योग्य है।"}
        </span>
      </div>
      <div className="">
        <img
          src="home/family.svg"
          className="w-[40%] absolute -bottom-0 right-16"
          alt="family"
        />
        <img
          src="home/generate.svg"
          className="w-[30%] absolute bottom-32 left-[15%] hover:shadow-xl"
          alt="generate"
        />
        <Link to="/scan">
          <button className="w-[15%] absolute bottom-14 left-[15%] p-3 text-[#00856F] font-semibold bg-[#B1D7D0] hover:bg-[#99d7cb] rounded-[10px] text-xs">
            {language === "english" ? "Know More about prescription" : "नुस्खे के बारे में और जानें"}
          </button>
        </Link>
        <Link to="/lab">
          <button className="w-[10%] absolute bottom-14 left-[35%] p-3 text-[#00856F] font-semibold bg-[#B1D7D0] hover:bg-[#99d7cb] rounded-[10px] text-xs">
            {language === "english" ? "Find Lab Test nearby" : "आस-पास लैब टेस्ट खोजें"}
          </button>
        </Link>
      </div>
      <div className="absolute top-5 right-5">
        <button onClick={toggleLanguage} className="px-4 py-2 bg-gray-200 rounded-md font-semibold">
          {language === "english" ? "हिंदी" : "English"}
        </button>
      </div>
    </div>
  );
}
