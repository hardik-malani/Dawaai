import React from "react";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="bg-[#B1D7D0] h-screen w-screen flex flex-col">
      <Navbar />
      <div className="text-[#00856F] mx-10 flex gap-6 relative top-32 left-[75%] font-semibold">
        <span className="hover:text-[#559c90]">Consult a doctor</span>
        <span className="hover:text-[#559c90]">Get Medical Tests</span>
      </div>
      <div className="w-[35%] text-3xl lg:text-4xl text-[#00856F] relative top-[35%] left-[15%] font-semibold">
        <span>
          "Empowering you to thrive in wellness, because a healthy life is a
          journey worth embracing."
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
          className="w-[30%] absolute bottom-28 left-[15%] hover:shadow-xl"
          alt="generate"
        />
      </div>
    </div>
  );
}
