import React, { useState } from "react";
import Upload from "../components/Upload";
import { MdArrowBack } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { MdOutlineUploadFile } from "react-icons/md";
import { CiMicrophoneOn } from "react-icons/ci";
import { GiSpeaker } from "react-icons/gi";



export default function Ocr() {
  const [showFamilyPhoto, setShowFamilyPhoto] = useState(true);
  const [progress, setProgress] = useState(50);

  const goBack = () => {
    window.history.back(); // Navigate back to the previous page
  };

  const handleSave = () => {
    setShowFamilyPhoto(!showFamilyPhoto); // Hide the family photo
  };

  return (
    <div className="flex bg-[#E1F9F5] justify-between items-center">
      <div className="bg-[#00856F] w-[60%] h-fit px-2 py-10">
        <button
          onClick={goBack}
          className="-mt-5 mb-5 text-white hover:text-gray-300"
        >
          <MdArrowBack size={40} />
        </button>
        <div className="flex gap-6 items-center">
          <FaPlus className="ml-10 text-white" size={36} />
          <span className="text-3xl text-white font-semibold">
            Welcome to Dawaai,
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col">
            <span className="text-sm m-10 text-white">
              Step 1 of 2: Upload your document
            </span>
            <progress
              className="progress w-[50%] -mt-5 ml-10 bg-white progress-success"
              value={progress}
              max="100"
            ></progress>
            <button className="my-5 p-3 flex gap-2 items-center ml-8 bg-[#5BBA9F] w-fit rounded-lg text-white hover:bg-[#4bc9a5]">
              <MdOutlineUploadFile /> Upload Document
            </button>
            <span className="p-3 flex gap-2 -mt-5 items-center ml-6 text-white">
              Or drag and drop your file here
            </span>
          </div>
          <div className="flex flex-col mt-5">
            <span className="text-sm m-10 text-white">
              Step 2 of 2: Processing your document
            </span>
            <progress
              className="progress w-[50%] -mt-5 ml-10 bg-white progress-success"
              value={progress}
              max="100"
            ></progress>
            <button className="my-5 p-3 text-xs flex gap-2 items-center ml-8 bg-[#5BBA9F] w-fit rounded-lg text-white hover:bg-[#4bc9a5]">
              Edit Text
            </button>
            <span className="p-3 text-xs flex gap-2 -mt-5 items-center ml-6 text-white">
              We extracted text from your document. You can edit it below.
            </span>
            <div className="flex gap-6">
              <textarea
                className="textarea textarea-success w-[80%] mx-10 mr-10 h-32"
                placeholder="Extracted text will appear here:"
              ></textarea>
              <button
                className="bg-[#5BBA9F] p-3 h-fit rounded-lg self-end hover:bg-[#4bc9a5] text-white"
                onClick={() => handleSave()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        {showFamilyPhoto && (
          <>
            <img
              src="/scan/family.svg"
              alt="family"
              className="w-[40%] mx-auto"
            />
            <p className="w-[40%] mx-auto text-[#00856F] font-semibold text-xl">
              "Health is not valued till sickness comes." - Thomas Fuller
            </p>
            <div className="flex justify-between bg-white p-2 absolute bottom-10 w-[30%] right-[3%] gap-2">
              <img src="/scan/sparkle.svg" alt="" />
              <input
                type="text"
                name="textbox"
                className="w-[100%] focus:outline-none"
              />
              <img src="/scan/search.svg" alt="" className="w-7" />
            </div>
          </>
        )}
        {!showFamilyPhoto && (
          <>
            <div className="bg-white chat mr-10 w-[30rem] mx-auto h-[400px] p-3 break-words">
              <div className="chat chat-start">
                <div className="chat-bubble">
                  It's over Anakin, <br />I have the high ground. <GiSpeaker size={30}/>
                </div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-start">
                <div className="chat-bubble">
                  It's over Anakin, <br />I have the high ground.
                </div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
            </div>
            <div className="flex justify-between bg-white p-2 relative top-24 w-[90%] gap-2">
              <img src="/scan/sparkle.svg" alt="" />
              <input
                type="text"
                name="textbox"
                className="w-[100%] focus:outline-none"
              />
              <img src="/scan/search.svg" alt="" className="w-7" />
              <CiMicrophoneOn size={40} color="green"/>
            </div>
          </>
        )}
      </div>
      <img src="/icon.svg" alt="icon" className="absolute right-4 top-4 w-12" />
    </div>
  );
}
