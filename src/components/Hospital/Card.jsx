import React from "react";
import { NavLink } from "react-router-dom";

const Card = ({ image,name, location, distance, phrase, cost , id }) => {
  return (
    <NavLink to={"/test/"+id}>
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-[18rem]">
      <img src={image} alt={name} className="w-[18rem] object-cover" />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{name}</h2>
        <div className="flex items-center mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 3a1 1 0 011-1h10a1 1 0 011 1v2h2a1 1 0 011 1v11a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1h2V3zm2 4v10h10V7H6zm6 3a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1zm-4 0a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1zm4 3a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1zM8 15a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-gray-600">{location}</p>
          <span className="mx-2">•</span>
          <p className="text-gray-600">{distance} km</p>
        </div>
        <p className="text-gray-700 mb-4">{phrase}</p>
        <p className="text-lg font-bold text-gray-800">₹{cost}</p>
      </div>
    </div></NavLink>
  );
};

export default Card;
