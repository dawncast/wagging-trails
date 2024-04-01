import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

import axios from "axios";

function CreateSchedule({ visible, onClose }) {
  // stub
  const ownerID = 5;

  const MAX_CONTENT_LENGTH = 255;

  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);

  // data for form dropdowns
  const [dogs, setDogs] = useState([]);
  const eventType = ["walk", "hike", "run", "dog park"];

  const handleContentChange = (e) => {
    const inputContent = e.target.value;

    // Check if inputContent exceeds the maximum length
    if (inputContent.length <= MAX_CONTENT_LENGTH) {
      // Update state if within the limit
      setContent(inputContent);
    }
  };

  const handleTagsChange = (e) => {
    const inputTags = e.target.value.split(",").map((tag) => tag.trim());
    const uniqueTags = inputTags.filter(
      (tag, index, self) => tag && self.indexOf(tag) === index
    );

    setTags(uniqueTags);
  };

  const userNavigation = [
    { name: "Your profile", href: "#" },
    { name: "Sign out", href: "#" },
  ];

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

  // for post submission
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

        {/* <Transition
          as={Fragment}
          show={isDropdownOpen}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
            {userNavigation.map((item) => (
              <Menu.Item key={item.name}>
                {({ active }) => (
                  <a
                    href={item.href}
                    className={classNames(
                      active ? "bg-gray-50" : "",
                      "block px-3 py-1 text-sm leading-6 text-gray-900"
                    )}
                  >
                    {item.name}
                  </a>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition> */}

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
