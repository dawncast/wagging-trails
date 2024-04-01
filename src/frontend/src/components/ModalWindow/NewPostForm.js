import React, { useState } from "react";
import axios from "axios";

function CreatePost({ visible, onClose, data }) {
  // stub
  const ownerID = 1;

  const MAX_CONTENT_LENGTH = 255;

  const [files, setFiles] = useState([]);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      walkID: data.walkid,
      ownerID: ownerID,
      content: content,
      tags: tags,
    };
    try {
      const response = await axios.post(
        "http://localhost:8800/posts/insert-post",
        postData
      );
      console.log("Post created:", response.data);
      // prepare data for upload
      let postID = response.data.postID;
      // Check if postID is available
      if (!postID) {
        throw new Error("postID is null or undefined");
      }
      const fileFormData = new FormData();
      for (const file of files) {
        fileFormData.append("files", file);
      }
      fileFormData.append("postID", postID); // Append postID here

      console.log(files);
      const uploadResponse = await axios.post(
        "http://localhost:8800/media/upload",
        fileFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded:", uploadResponse.data);
      // reset
      setFiles([]);
      setContent("");
      setTags([]);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

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
          Create a Post for your{" "}
          {data.meetupid !== null
            ? `meetup with ${data.met_up_owners.join(", ")}`
            : `walk with ${data.dogs.join(", ")}`}
        </h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full border border-gray-300 text-gray-900 rounded-md py-2 px-3 mb-3 focus:outline-none focus:ring focus:border-blue-400"
          />

          <textarea
            placeholder="Content"
            value={content}
            onChange={handleContentChange}
            maxLength={MAX_CONTENT_LENGTH}
            className="w-full border border-gray-300 text-gray-900 rounded-md py-2 px-3  focus:outline-none focus:ring focus:border-blue-400"
            onKeyDown={(e) => {
              if (
                content.length >= MAX_CONTENT_LENGTH &&
                e.key !== "Backspace"
              ) {
                e.preventDefault(); // Prevent typing when max limit is reached
              }
            }}
          />
          <div className="text-gray-500 text-xs mb-3 ml-auto text-right">
            {MAX_CONTENT_LENGTH - content.length} characters remaining
          </div>

          <input
            type="text"
            placeholder="Place your tags here. Add commas (', ') to separate!"
            value={tags.join(",")}
            onChange={handleTagsChange}
            className="w-full border border-gray-300 text-gray-900 rounded-md py-2 px-3 mb-3 focus:outline-none focus:ring focus:border-blue-400"
          />
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

export default CreatePost;
