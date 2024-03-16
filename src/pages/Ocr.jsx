import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdArrowBack } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { MdOutlineUploadFile } from "react-icons/md";
import { CiMicrophoneOn } from "react-icons/ci";
import { GiSpeaker } from "react-icons/gi";
import { IoMdSend } from "react-icons/io";
import { AiOutlineAudio } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";

export default function Ocr() {
  const [showFamilyPhoto, setShowFamilyPhoto] = useState(true);
  const [progress, setProgress] = useState(50);
  const [ocrResult, setOcrResult] = useState("");
  const [image, setImage] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [languages, setLanguages] = useState({});
  const [speechToTextResult, setSpeechToTextResult] = useState(null);
  const [language, setLanguage] = useState("english");

  const [showDropdown, setShowDropdown] = useState(false);

  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };


  useEffect(() => {
    async function fetchLanguages() {
      try {
        const res = await axios.get("http://localhost:5000/languages");
        setLanguages(res.data);
        console.log(selectedLanguage);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    }
    fetchLanguages();
  }, []);

  const goBack = () => {
    window.history.back(); // Navigate back to the previous page
  };

  const handleSave = () => {
    setShowFamilyPhoto(!showFamilyPhoto); // Toggle the family photo display
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      console.log("File read successfully:", reader.result);
      setProgress(0);
      setOcrResult("");
      setImage(reader.result);
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

  const uploadImage = async (imageData) => {
    try {
      const response = await axios.post("http://localhost:5000/upload", {
        imageData: imageData,
      });

      setOcrResult(response.data.text);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const toggleChat = () => {
    setChatVisible(!chatVisible);
  };

  const handleChatSubmit = async (event) => {
    event.preventDefault();
    if (newMessage.trim() !== "") {
      try {
        let response;
        if (selectedLanguage === "eng_Latn") {
          response = await axios.post("http://localhost:5000/query", {
            ocr: ocrResult,
            prompt: newMessage,
          });
        } else {
          response = await axios.post(
            "http://localhost:5000/translated_query",
            {
              ocr: ocrResult,
              prompt: newMessage,
              src_lang: selectedLanguage,
            }
          );
        }

        const answer = response.data.answer;
        setMessages([...messages, { text: newMessage, isUser: true }]);
        setMessages([...messages, { text: answer, isUser: false }]);
        setNewMessage("");
        // Store the text-to-speech data
        const utterance = new SpeechSynthesisUtterance(answer);

        if (selectedLanguage !== "en") {
          switch (selectedLanguage) {
            case "guj_Gujr": //
              utterance.lang = "gu-IN";
              utterance.voice = speechSynthesis
                .getVoices()
                .find((voice) => voice.lang === "gu-IN");
              break;
            case "hin_Deva": //
              utterance.lang = "hi-IN";
              utterance.voice = speechSynthesis
                .getVoices()
                .find((voice) => voice.lang === "hi-IN");
              break;
            case "kan_Knda": //
              utterance.lang = "kn-IN";
              utterance.voice = speechSynthesis
                .getVoices()
                .find((voice) => voice.lang === "kn-IN");
              break;
            case "gom_Deva": //
              utterance.lang = "kok-IN";
              utterance.voice = speechSynthesis
                .getVoices()
                .find((voice) => voice.lang === "kok-IN");
              break;
            case "mar_Deva": //
              utterance.lang = "mr-IN";
              utterance.voice = speechSynthesis
                .getVoices()
                .find((voice) => voice.lang === "mr-IN");
              break;
            case "pan_Guru":
              utterance.lang = "pa-IN"; //
              utterance.voice = speechSynthesis
                .getVoices()
                .find((voice) => voice.lang === "pa-IN");
              break;
            case "tam_Taml":
              utterance.lang = "ta-IN"; //
              utterance.voice = speechSynthesis
                .getVoices()
                .find((voice) => voice.lang === "ta-IN");
              break;
            case "tel_Telu":
              utterance.lang = "te-IN"; //
              utterance.voice = speechSynthesis
                .getVoices()
                .find((voice) => voice.lang === "te-IN");
              break;
            default:
              utterance.lang = "en-US";
              utterance.voice = speechSynthesis
                .getVoices()
                .find((voice) => voice.lang === "en-US");
              break;
          }
        } else {
          utterance.lang = "en-US";
          utterance.voice = speechSynthesis
            .getVoices()
            .find((voice) => voice.lang === "en-US");
        }
        setSpeechToTextResult(utterance);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleSpeechToText = async () => {
    try {
      const recognition = new window.webkitSpeechRecognition();
      let langCode = "en-US"; // Default language code

      switch (selectedLanguage) {
        case "guj_Gujr":
          langCode = "gu-IN";
          break;
        case "hin_Deva":
          langCode = "hi-IN";
          break;
        case "kan_Knda":
          langCode = "kn-IN";
          break;
        case "gom_Deva":
          langCode = "kok-IN";
          break;
        case "mar_Deva":
          langCode = "mr-IN";
          break;
        case "pan_Guru":
          langCode = "pa-IN";
          break;
        case "tam_Taml":
          langCode = "ta-IN";
          break;
        case "tel_Telu":
          langCode = "te-IN";
          break;
        default:
          langCode = "en-US";
          break;
      }

      recognition.lang = langCode;

      recognition.onresult = (event) => {
        const speechToTextResult = event.results[0][0].transcript;
        setNewMessage(speechToTextResult);
      };

      recognition.start();
    } catch (error) {
      console.error("Error converting speech to text:", error);
    }
  };

  const handlePlayButtonClick = () => {
    // Check if speech synthesis is speaking
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    } else {
      speechSynthesis.speak(speechToTextResult);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "english" ? "hindi" : "english");
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
            {language === "english"
              ? "Welcome to Dawaai,"
              : "डवाई में आपका स्वागत है,"}
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col">
            <span className="text-sm m-10 text-white">
              {language === "english"
                ? "Step 1 of 2: Upload your document"
                : "चरण 1 में से 2: अपना दस्तावेज़ अपलोड करें"}
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
              <MdOutlineUploadFile />{" "}
              {language === "english"
                ? "Upload Document"
                : "दस्तावेज़ अपलोड करें"}
            </button>
            <span className="p-3 flex gap-2 -mt-5 items-center ml-6 text-white">
              {language === "english"
                ? "Or drag and drop your file here"
                : "या अपना फ़ाइल यहाँ खींचें और छोड़ें"}
            </span>
            {image && ocrResult === "" && (
              <div className="flex justify-center items-center h-32">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
              </div>
            )}
            {/* {image && (
            <img
              src={image}
              alt="uploaded-image"
              className="self-center w-[8rem] md:w-[4rem]"
            />
          )} */}
          </div>
          <div className="flex flex-col mt-5">
            <span className="text-sm m-10 text-white">
              {language === "english"
                ? "Step 2 of 2: Processing your document"
                : "चरण 2 में से 2: आपका दस्तावेज़ प्रोसेस करना"}
            </span>
            <progress
              className="progress w-[50%] -mt-5 ml-10 bg-white progress-success"
              value={progress}
              max="100"
            ></progress>
            <button className="my-5 p-3 text-xs flex gap-2 items-center ml-8 bg-[#5BBA9F] w-fit rounded-lg text-white hover:bg-[#4bc9a5]">
              {language === "english" ? "Edit Text" : "पाठ संपादित करें"}
            </button>
            <span className="p-3 text-xs flex gap-2 -mt-5 items-center ml-6 text-white">
              {language === "english"
                ? "We extracted text from your document. You can edit it below."
                : "हमने आपके दस्तावेज़ से पाठ निकाला। आप इसे नीचे संपादित कर सकते हैं।"}
            </span>
            <div className="flex gap-6">
              <textarea
                className="border border-black rounded-lg p-3 mb-4 w-full h-32"
                placeholder={
                  language === "english"
                    ? "Text will appear here..."
                    : "पाठ यहाँ दिखाई जाएगा..."
                }
                value={ocrResult}
              ></textarea>
              <button
                className="bg-[#5BBA9F] p-3 h-fit rounded-lg self-end hover:bg-[#4bc9a5] text-white"
                onClick={() => handleSave()}
              >
                {language === "english" ? "Save" : "बचाना"}
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
              {language === "english"
                ? '"Health is not valued till sickness comes." - Thomas Fuller'
                : '"स्वास्थ्य की कीमत तब तक महसूस नहीं की जाती है जब बीमारी आती है।" - थॉमस फुलर'}
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
            <div className="bg-white p-3 mx-10 mb-5 rounded-lg my-10">
              <span className="font-semibold">
                {language === "english" ? "Your Input:" : "आपका इनपुट:"}
              </span>
              <span className="ml-2">{newMessage}</span>
            </div>
            <div className="bg-white chat mr-10 w-[30rem] mx-auto h-[400px] p-3 break-words overflow-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chat ${
                    message.isUser ? "chat-end" : "chat-start"
                  }`}
                >
                  <div className="chat-bubble">
                    {message.text}
                    {!message.isUser && (
                      <GiSpeaker
                        size={30}
                        onClick={() => handlePlayButtonClick(message.text)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between bg-white p-2 relative top-12 w-[90%] gap-2">
              <img src="/scan/sparkle.svg" alt="" />
              <button
                onClick={handleSpeechToText}
                className="w-[10%] focus:outline-none"
              >
                <AiOutlineAudio size={30} color="green" />
              </button>
              <select
                className="w-[20%] focus:outline-none border-none rounded-lg p-3"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {Object.keys(languages).map((key) => (
                  <option key={key} value={key}>
                    {languages[key]}
                  </option>
                ))}
              </select>
              <input
                id="textbox"
                type="text"
                name="textbox"
                className="w-[50%] focus:outline-none border-none rounded-lg p-3"
                placeholder={
                  language === "english"
                    ? "Type your message here..."
                    : "अपना संदेश यहाँ लिखें..."
                }
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                className="w-[10%] focus:outline-none"
                onClick={handleChatSubmit}
              >
                <IoMdSend size={30} color="#5BBA9F" />
              </button>
            </div>
          </>
        )}
      </div>
      <img src="/icon.svg" alt="icon" className="absolute right-4 top-4 w-12" />
      <button
        onClick={toggleLanguage}
        className="absolute right-20 top-4 px-3 py-1 rounded bg-gray-200 text-gray-800 mt-2 font-semibold"
      >
        {language === "english" ? "हिंदी" : "English"}
      </button>
      <div>
      {ocrResult === "" && (
        <div className="absolute top-[3%] right-[20%]">
          <button
            className="flex items-center justify-center bg-[#5BBA9F] text-white px-4 py-2 rounded-lg hover:bg-[#4bc9a5]"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaShoppingCart className="mr-2" /> {/* Shopping cart icon */}
            {language === "english" ? "Add Medicines" : "दवाएं जोड़ें"}
          </button>
          {showDropdown && (
            <div className="flex gap-3">
              <select className="ml-2 py-2 px-4 bg-white border border-gray-300 rounded">
                <option value="paracetamol">Paracetamol</option>
                <option value="ibuprofen">Ibuprofen</option>
              </select>
              <button
                className="flex gap-2 items-center"
                onClick={handleAdd}
              >
                Add <FaPlus />
              {added && <span>Added</span>}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  );
}
