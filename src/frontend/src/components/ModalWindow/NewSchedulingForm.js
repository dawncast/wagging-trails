import React, { useState, useEffect } from "react";
import DropdownSelect from "./Dropdown";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";

import axios from "axios";

function CreateSchedule({ visible, onClose }) {
  // stub
  const ownerID = 3;

  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);

  // data for form dropdowns
  const [dogs, setDogs] = useState([]);
  const [friends, setFriends] = useState([]);
  const eventType = [
    { key: "1", text: "walk", value: "walk" },
    { key: "2", text: "hike", value: "hike" },
    { key: "3", text: "run", value: "run" },
    { key: "4", text: "dog park", value: "dog park" },
  ];

  const [rating, setRating] = useState(0);

  const handleStarClick = (clickedRating) => {
    setRating(clickedRating);
  };

  // Dog selection
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

  // Friend selection
  const [selectedFriends, setSelectedFriends] = useState([]);
  const handleFriendsSelected = (item) => {
    if (
      !selectedFriends.some((selectedItem) => selectedItem.key === item.key)
    ) {
      setSelectedFriends([...selectedFriends, item]);
    }
  };
  const handleFriendRemoved = (itemToRemove) => {
    const updatedSelectedFriends = selectedFriends.filter(
      (item) => item.key !== itemToRemove.key
    );
    setSelectedFriends(updatedSelectedFriends);
  };

  // Walk Event Selection
  const [selectedWalkEvent, setSelectedWalkEvent] = useState(null);

  const handleWalkEventSelected = (event) => {
    setSelectedWalkEvent(event.value);
  };

  // for dog data fetching
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

  // for friends fetching
  useEffect(() => {
    fetch(`http://localhost:8800/friend-list/${ownerID}/fetch-friendship`)
      .then((response) => response.json())
      .then((data) => {
        const parsedFriends = data.data.map((friend) => ({
          key: `${friend.ownerid2}`,
          text: friend.owner_name,
          value: `${friend.ownerid2}`,
        }));
        setFriends(parsedFriends);
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

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

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

        <div className="flex items-center my-3 mx-1">
          {/* Selecting Dogs */}
          <h3 className="text-gray-800 mr-3">Select Dogs*:</h3>
          <DropdownSelect
            userSelection={dogs}
            onItemSelected={handleDogsSelected}
          />
          <div className="text-gray-600 ml-5 m-1">
            <ul className="">
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
        </div>
        <div className="flex flex-wrap">
          {/* Selecting a Type */}
          <h3 className="text-gray-800 mr-3 ml-1">Select Event Type:</h3>
          <DropdownSelect
            userSelection={eventType}
            onItemSelected={handleWalkEventSelected}
          />
        </div>

        <input
          type="text"
          placeholder="YYYY-MM-DD"
          onChange={null}
          className="w-full border border-gray-300 text-gray-900 rounded-md py-2 px-3 my-3 mx-1 focus:outline-none focus:ring focus:border-blue-400"
        />

        {/* Walk Form */}
        <h3 className="mt-2 font-semibold text-center text-lg text-gray-700 my-3">
          Is it already a finished schedule? Log it as a walk or meetup!
        </h3>
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Location"
            onChange={null}
            className="w-full border border-gray-300 text-gray-900 rounded-md py-2 px-3 mb-3 mx-1 focus:outline-none focus:ring focus:border-blue-400"
          />

          <input
            type="text"
            placeholder="00:00:00"
            onChange={null}
            className="w-full border border-gray-300 text-gray-900 rounded-md py-2 px-3 mb-3 mx-1 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="distance (km)"
            onChange={null}
            className="w-full border border-gray-300 text-gray-900 rounded-md py-2 px-3 mb-3 mx-1 focus:outline-none focus:ring focus:border-blue-400"
          />

          <div className="flex mx-1 mb-3">
            <span className="text-gray-400 mr-3 mb-1">Rating: </span>
            {[0, 1, 2, 3, 4].map((star) => (
              <StarIcon
                key={star}
                className={classNames(
                  rating > star ? "text-indigo-500" : "text-gray-300",
                  "h-5 w-5 flex-shrink-0 cursor-pointer"
                )}
                onClick={() => handleStarClick(star + 1)}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
        <div className="flex items-center mx-1">
          {/* Selecting Friends */}
          <h3 className="text-gray-800 mr-3">Select Friends*:</h3>
          <DropdownSelect
            userSelection={friends}
            onItemSelected={handleFriendsSelected}
          />
          <div className="text-gray-600 ml-5">
            <ul className="">
              {selectedFriends.map((friend, index) => (
                <span key={index} className="mr-4">
                  {friend.text}
                  <button onClick={() => handleFriendRemoved(friend)}>
                    <XMarkIcon className="h-3 w-3 ml-2" aria-hidden="true" />
                  </button>
                </span>
              ))}
            </ul>
          </div>
        </div>

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
