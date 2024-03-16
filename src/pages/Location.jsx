import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import Tests from "../pages/Hospital/test";
import { MdArrowBack } from "react-icons/md";


const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const Location = (props) => {
  const { id } = useParams();
  const test = Tests.find((test) => test.test_id === parseInt(id));
  const { test_name, location, description, price } = test;
  const [pickupLocation, setPickupLocation] = useState("");
  const [response, setResponse] = useState(null);

  const goBack = () => {
    window.history.back(); // Navigate back to the previous page
  };

  const directionsCallback = (result, status) => {
    if (status === "OK") {
      setResponse(result);
    } else {
      console.error(`Directions request failed due to ${status}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#E1F9F5]">
      <div className="flex h-4/6 rounded-3xl p-7 gap-10 justify-center bg-[#00856F] items-center">
        <div className="w-2/5">
          <img src="https://www.shutterstock.com/image-photo/modern-hospital-style-building-260nw-212251981.jpg" alt="Hospital" className="w-full h-auto" />
        </div>
        <div className="w-3/5 px-4">
          <h1 className="text-3xl font-bold">{test_name}</h1>
          <p className="text-l text-white mb-4 text-right">{location}</p>
          <p className="text-lg mb-4">{description}</p>
          <div className="text-xl font-semibold">Cost: ₹ {price}</div>
          <div className="mt-4">
            <label htmlFor="pickupLocation" className="block text-lg font-semibold">
              Enter Pickup Location:
            </label>
            <input
              id="pickupLocation"
              type="text"
              className="border rounded p-2 w-full"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
          </div>
          {pickupLocation && (
            <div className="mt-4">
              <LoadScript googleMapsApiKey="AIzaSyC8XBR8RQG5FAzoiTDicg8enboefziSOnU">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={12}
                  options={options}
                >
                  <DirectionsService
                    options={{
                      destination: location,
                      origin: pickupLocation,
                      travelMode: "DRIVING",
                    }}
                    callback={directionsCallback}
                  />
                  {response && <DirectionsRenderer directions={response} />}
                </GoogleMap>
              </LoadScript>
            </div>
          )}
        </div>
      </div>
      <button
          onClick={goBack}
          className="absolute top-4 left-4"
        >
          <MdArrowBack size={40} />
        </button>
    </div>
  );
};

export default Location;