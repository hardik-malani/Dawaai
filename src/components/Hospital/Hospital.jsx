import React, { useState, useEffect } from "react";
import Card from "./Card";
import axios from "axios";
import Tests from "../../mock-data/testData";

export default function Hospital() {
  const [sliderValue, setSliderValue] = useState(600);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [botResponse, setBotResponse] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [filteredCardData, setFilteredCardData] = useState(Tests);
  const [testDetails, setTestDetails] = useState(null);

  const [selectedTests, setSelectedTests] = useState([]);

  const handleCheckboxChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setSelectedTests((prevSelectedTests) => [...prevSelectedTests, value]);
    } else {
      setSelectedTests((prevSelectedTests) => prevSelectedTests.filter(test => test !== value));
    }
    console.log("Selected tests:", selectedTests);
  };

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  const handleSliderChange = (event) => {
    setSliderValue(parseInt(event.target.value));
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleMessageSubmit = async (event) => {
    event.preventDefault();
    if (newMessage.trim() !== "") {
      const newPosition = messages.length % 2 === 0 ? "end" : "start";
      setMessages([...messages, { text: newMessage, position: newPosition }]);
      setNewMessage("");
  
      try {
        const response = await axios.post("http://localhost:5000/test", {
          prompt_2: newMessage,
        });
        const responseData = response.data;
        const botResponseData = responseData.result;
        setBotResponse(botResponseData);
  
        if (responseData.test_details && responseData.test_details.length > 0) {
          const newFilteredCardData = Tests.filter((test) => {
            return responseData.test_details.some(
              (detail) => detail.test_name === test.test_name
            );
          });
          setFilteredCardData(newFilteredCardData);
          setTestDetails(responseData.test_details[0]); 
        } else {
          setFilteredCardData([]);
          setTestDetails(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };  

  useEffect(() => {
    console.log(botResponse);
  }, [botResponse]);

  const cardData = Tests;

  return (
    <>
      <div className="bg-gradient-to-b from-[#aad0f5] via-[#c4def9] to-white flex">
        <div
          className={`border-dashed border-r border-black w-[30%] h-screen md:flex hidden flex-col items-center gap-6 my-10 over ${
            isFilterVisible ? "block" : "hidden"
          }`}
        >
          <div className="flex justify-center">
            <input
              src={"/AssetsHospital/Filter.svg"}
              type="image"
              alt="filter"
              className="w-[8rem]"
              onClick={toggleFilterVisibility}
            />
          </div>
          <div className="bg-[#92c3f5] rounded-md flex flex-col mt-10">
            <h1 className="flex justify-center h-8 font-semibold">Price</h1>
            <div className="mt-1 max-w-xl h-20 mx-auto w-60 px-6">
              <input
                id="range"
                type="range"
                className="block w-full py-2 text-gray-700 bg-white border border-gray-300 rounded-md"
                value={sliderValue}
                onChange={handleSliderChange}
                min={100} // set min value
                max={1000} // set max value
              />
              <div className="flex justify-between text-xs -mt-2">
                <span>₹ 100</span>
                <span>₹ 1000</span>
              </div>
            </div>
          </div>
          <div className="bg-[#92c3f5] rounded-md flex flex-col h-[8rem] w-60 my-2">
            <h1 className="flex justify-center h-8 font-semibold">Location</h1>
            <div className="mt-1 max-w-xl pb-2 mx-auto w-[13rem] h-20 px-6 text-xs">
              <select
                id="location"
                value={selectedLocation}
                onChange={handleLocationChange}
                className="block w-full py-1 text-gray-700 bg-blue-400 border border-gray-300 rounded-md"
              >
                <option value="">Select location</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Kolkata">Kolkata</option>
              </select>
            </div>
          </div>
          <div className="bg-[#92c3f5] rounded-md flex flex-col h-auto w-60 p-4">
            <h1 className="flex justify-center font-semibold h-8">
              Medical Test
            </h1>
            <div className="mt-4">
              <input
                type="checkbox"
                id="test1"
                name="test1"
                value="Comprehensive Metabolic Panel (CMP)"
                onChange={handleCheckboxChange}
              />
              <label htmlFor="test1">Comprehensive Metabolic Panel (CMP)</label>
              <br />

              <input
                type="checkbox"
                id="test2"
                name="test2"
                value="Complete Blood Count (CBC)"
                onChange={handleCheckboxChange}
              />
              <label htmlFor="test2">Complete Blood Count (CBC)</label>
              <br />

              <input
                type="checkbox"
                id="test3"
                name="test3"
                value="Lipid Profile"
                onChange={handleCheckboxChange}
              />
              <label htmlFor="test3">Lipid Profile</label>
              <br />

              <input
                type="checkbox"
                id="test4"
                name="test4"
                value="Liver Panel"
                onChange={handleCheckboxChange}
              />
              <label htmlFor="test4">Liver Panel</label>
              <br />

              <input
                type="checkbox"
                id="test5"
                name="test5"
                value="Thyroid Panel"
                onChange={handleCheckboxChange}
              />
              <label htmlFor="test5">Thyroid Panel</label>
              <br />

              <input
                type="checkbox"
                id="test6"
                name="test6"
                value="Hemoglobin A1c"
                onChange={handleCheckboxChange}
              />
              <label htmlFor="test6">Hemoglobin A1c</label>
              <br />

              <input
                type="checkbox"
                id="test7"
                name="test7"
                value="Urinalysis"
                onChange={handleCheckboxChange}
              />
              <label htmlFor="test7">Urinalysis</label>
              <br />

              <input
                type="checkbox"
                id="test8"
                name="test8"
                value="Blood Glucose Test"
                onChange={handleCheckboxChange}
              />
              <label htmlFor="test8">Blood Glucose Test</label>
              <br />

              <input
                type="checkbox"
                id="test9"
                name="test9"
                value="C-Reactive Protein (CRP)"
                onChange={handleCheckboxChange}
              />
              <label htmlFor="test9">C-Reactive Protein (CRP)</label>
              <br />

              <input
                type="checkbox"
                id="test10"
                name="test10"
                value="Prothrombin Time (PT)"
                onChange={handleCheckboxChange}
              />
              <label htmlFor="test10">Prothrombin Time (PT)</label>
              <br />

              <input
                type="checkbox"
                id="test11"
                name="test11"
                value="Activated Partial Thromboplastin Time (APTT)"
                onChange={handleCheckboxChange}
              />
              <label htmlFor="test11">
                Activated Partial Thromboplastin Time (APTT)
              </label>
              <br />
            </div>
          </div>
        </div>
        <div className="flex flex-col mx-auto">
          <div className="self-center">
            <form className="flex">
              <input
                className="peer w-full p-2 rounded-md outline-none text-sm text-gray-700 pr-2 m-4"
                type="text"
                id="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search something.."
              />
              {/* <AiOutlineSearch className="self-center mt-4 ml-3" size={30} /> */}
            </form>
            <div className="container mx-auto mt-10 flex justify-around px-2 md:gap-x-4 gap-y-3 flex-wrap">
              {filteredCardData
                .filter(
                  (card) => parseInt(card.price) <= sliderValue // Filter cards based on the slider value
                )
                .filter((card) => {
                  // Filter cards based on the search input value
                  const searchTermLower = searchTerm.toLowerCase();
                  return (
                    card.test_name.toLowerCase().includes(searchTermLower) ||
                    card.location.toLowerCase().includes(searchTermLower)
                  );
                })
                .filter((card) => {
                  // Filter cards based on the selected location
                  return (
                    selectedLocation === "" ||
                    card.location === selectedLocation
                  );
                })
                .filter((card) => {
                  // Filter cards based on the selected tests
                  return (
                    selectedTests.length === 0 ||
                    Object.values(card).some(value => {
                      if (Array.isArray(value)) {
                        return value.some(test => selectedTests.includes(test));
                      } else {
                        return selectedTests.includes(value);
                      }
                    })
                  );
                })
                         
                
                .map((card, index) => (
                  <Card
                    key={index}
                    image={card.image_link}
                    name={card.test_name}
                    location={card.location}
                    id={card.test_id}
                    cost={card.price}
                  />
                ))}
            </div>
          </div>
        </div>
        {isChatVisible && (
          <div className="fixed bottom-10 left-0 min-w-[200px] w-[350px] h-[21rem] bg-gradient-to-b from-[#aad0f5] via-[#c4def9] to-whiteopacity-90 rounded-lg ml-2 px-2 border-2 border-blue-500">
            <div className="chat-container h-[18rem]">
              {messages.map((message, index) => (
                <div key={index} className={`chat chat-${message.position}`}>
                  <div className="chat-bubble">{message.text}</div>
                </div>
              ))}
              {botResponse && (
                <div className="chat chat-end">
                  <div className="chat-bubble">{botResponse}</div>
                </div>
              )}
            </div>
            <form onSubmit={handleMessageSubmit}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="rounded-md p-1 fixed bottom-10 my-2 opacity-90"
                placeholder="Type Your text..."
              />
              <button
                type="submit"
                className="fixed bottom-10 ml-60 mb-2 bg-green-600 p-1 rounded-lg"
              >
                Send
              </button>
            </form>
          </div>
        )}

        <button
          className="fixed bottom-20 right-10 bg-blue-500 text-white py-2 px-4 rounded-lg"
          onClick={toggleChatVisibility}
        >
          {isChatVisible ? "Hide Chat" : "Show Chat"}
        </button>
      </div>
    </>
  );
}
