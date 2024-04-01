import React, { useState, useEffect } from "react";
import DropdownSelect from "./Dropdown";
import { XMarkIcon } from "@heroicons/react/24/outline";

import axios from "axios";

function CreateSchedule({ visible, onClose }) {
  // stub
  const ownerID = 5;

  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);

  // data for form dropdowns
  const [dogs, setDogs] = useState([]);
  const eventType = ["walk", "hike", "run", "dog park"];
  const [selectedDogs, setSelectedDogs] = useState([]);

  const handleDogsSelected = (item) => {
    if (!selectedDogs.some((selectedItem) => selectedItem.key === item.key)) {
      setSelectedDogs([...selectedDogs, item]);
    }
  };

  const handleDogRemoved = (itemToRemove) => {
    const updatedSelectedDogs = selectedDogs.filter(
      (item) => item.key !== itemToRemove.key
    );
    setSelectedDogs(updatedSelectedDogs);
  };

  //for dog data fetching
  useEffect(() => {
    fetch(`http://localhost:8800/dog/${ownerID}/get-dog-for`)
      .then((response) => response.json())
      .then((data) => {
        const parsedDogs = data.data.map((dog) => ({
          key: `${dog.dogid}`,
          text: dog.name,
          value: `${dog.dogid}`,
        }));
        setDogs(parsedDogs);
      })
      .catch((error) => console.error("Error fetching dogs:", error));
  }, [ownerID]);

  // for schedule submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      walkID: null,
      ownerID: ownerID,
      content: content,
      tags: tags,
    };
    try {
      const response = await axios.post(
        `http://localhost:8800/dog/${ownerID}/insert-post`,
        postData
      );
      console.log("Post created:", response.data);
      // prepare data for upload
      let postID = response.data.postID;
      // Check if postID is available
      if (!postID) {
        throw new Error("postID is null or undefined");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  console.log(dogs);

  // check if user wants to create a post
  if (!visible) return null;

  const handleOnClose = (e) => {
    if (e.target.id === "container") onClose();
  };

  return (
    <div
      id="container"
      onClick={handleOnClose}
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
    >
      <div className="bg-white p-4 rounded-xl">
        <h2 className="font-semibold text-center text-xl text-gray-700">
          Create a Schedule
        </h2>
        <h2 className="text-gray-800">Select Dogs:</h2>

        {/* Selecting Dogs */}
        <DropdownSelect
          userSelection={dogs}
          onItemSelected={handleDogsSelected}
          onItemRemoved={handleDogRemoved}
        />
        <div className="text-gray-600">
          <ul className="flex flex-wrap">
            {selectedDogs.map((dog, index) => (
              <span key={index} className="mr-4">
                {dog.text}

                <button onClick={() => handleDogRemoved(dog)}>
                  <XMarkIcon className="h-3 w-3 ml-4" aria-hidden="true" />
                </button>
              </span>
            ))}
          </ul>
        </div>

        {/* Selecting a Type */}

        <form onSubmit={handleSubmit} className="mt-4">
          <button
            type="submit"
            className="mx-auto w-30 bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-400"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateSchedule;
