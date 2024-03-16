import React, { useState } from "react";
import { MdArrowBack, MdOutlineUploadFile } from "react-icons/md";
import ReactPlayer from "react-player";

export default function Therapist() {
  const goBack = () => {
    window.history.back();
  };

  const [progress, setProgress] = useState(0);
  const [ocrResult, setOcrResult] = useState("");
  const [image, setImage] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);
  const [cameraImage, setCameraImage] = useState(null); // State to store camera image
  const [videoFile, setVideoFile] = useState(null); // State to store uploaded video file
  const [isVideoUploaded, setIsVideoUploaded] = useState(false); // State to track whether video is uploaded

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      console.log("File read successfully:", reader.result);
      setProgress((prevProgress) => prevProgress + 50); // Increase progress by 50
      setOcrResult("");
      setImage(reader.result);
      // setCameraImage(reader.result); // Set camera image state
      uploadImage(reader.result);
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      console.error("No file selected.");
    }
  };

  const handleCameraOn = () => {
    // Increase progress by another 50 when switch camera button is clicked
    setProgress((prevProgress) => prevProgress + 50);
    // Implement other camera handling logic here
    fetch("http://172.16.41.154:5000/video_feed") // Fetch video feed route
      .then((response) => {
        // Handle response
        console.log("Response received:", response);
        // Set camera image state to the response
        setCameraImage(response.url);
      })
      .catch((error) => {
        // Handle error
        console.error("Error fetching video feed:", error);
      });
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    setVideoFile(file);
    setIsVideoUploaded(true);
  };

  return (
    <>
      <div className="flex bg-[#E1F9F5] items-center h-fit">
        <div className="bg-[#00856F] w-[60%] h-screen px-2 py-10">
          <div className="flex items-center gap-48 px-32">
            <button onClick={goBack} className="text-white hover:text-gray-300">
              <MdArrowBack size={40} />
            </button>
            <span className="text-white text-2xl font-semibold">
              Start the Appointment
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm m-10 text-white">
              Step 1 of 2: Upload your document
            </span>
            <progress
              className="progress w-[50%] -mt-5 ml-10 bg-white progress-success"
              value={progress}
              max="100"
            ></progress>
            <input
              type="file"
              id="fileUpload"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            <button
              className="my-5 p-3 flex gap-2 items-center ml-8 bg-[#5BBA9F] w-fit rounded-lg text-white hover:bg-[#4bc9a5]"
              onClick={() => document.getElementById("fileUpload").click()}
            >
              <MdOutlineUploadFile /> Upload EEG Document
            </button>
            <span className="p-3 flex gap-2 -mt-5 items-center ml-6 text-white">
              Or drag and drop your file here
            </span>
          </div>
          <div className="flex gap-5 justify-between px-10">
            <div className="bg-white h-48 w-96 rounded-lg">
            {image && (
                <img
                  src={image}
                  alt="Camera"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="bg-black h-48 w-48 rounded-lg">
              {cameraImage && (
                <img
                  src={cameraImage}
                  alt="Camera"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>
          <button
            className="my-5 p-3 flex gap-2 items-center ml-8 bg-[#5BBA9F] w-fit rounded-lg text-white hover:bg-[#4bc9a5]"
            onClick={handleCameraOn}
          >
            Switch On your Camera
          </button>
        </div>
        <div className="flex flex-col px-10">
          <div className="w-[24rem] h-48 bg-[#D9D9D9] rounded-2xl">
            {isVideoUploaded && (
              <ReactPlayer
                url={URL.createObjectURL(videoFile)}
                controls
                width="100%"
                height="100%"
              />
            )}
          </div>
          <input
            type="file"
            id="videoUpload"
            style={{ display: "none" }}
            accept="video/*" // Accept only video files
            onChange={handleVideoUpload}
          />
          <button
            className="my-5 p-3 flex gap-2 items-center ml-8 bg-[#5BBA9F] w-fit rounded-lg text-white hover:bg-[#4bc9a5]"
            onClick={() => document.getElementById("videoUpload").click()}
          >
            Upload Video
          </button>
          <div id="graph" className="w-[24rem] h-40 bg-white rounded-2xl"></div>
        </div>
      </div>
      <div>
        <img
          src="/icon.svg"
          alt="icon"
          className="absolute right-4 top-4 w-12"
        />
      </div>
    </>
  );
}
