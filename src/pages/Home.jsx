import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="bg-[#E1F9F5] h-screen w-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="text-[#00856F] mx-10 flex gap-6 relative top-32 left-[75%] font-semibold">
      <Link to="/therapist"><span className="hover:text-[#559c90]">Consult a Therapist</span></Link>
        <Link to="/lab">
        <span className="hover:text-[#559c90]">Get Medical Tests</span>
        </Link>
      </div>
      <div className="w-[40%] text-3xl lg:text-4xl text-[#00856F] relative top-[27%] left-[15%] font-semibold">
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
          className="w-[30%] absolute bottom-32 left-[15%] hover:shadow-xl"
          alt="generate"
        />
        <Link to="/scan">
          <button className="w-[10%] absolute bottom-14 left-[15%] p-3 text-[#00856F] font-semibold bg-[#B1D7D0] hover:bg-[#99d7cb] rounded-[10px]">
            Scan Report
          </button>
        </Link>
        <Link to="/lab" >
        <button className="w-[10%] absolute bottom-14 left-[30%] p-3 text-[#00856F] font-semibold bg-[#B1D7D0] hover:bg-[#99d7cb] rounded-[10px]">
          Lab Test
        </button>
        </Link>
      </div>
    </div>
  );
}
