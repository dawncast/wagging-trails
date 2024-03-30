import React, { useState } from "react";
import axios from "axios";

function CreatePost() {
  const walkID = 12;
  const ownerID = 1;
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleTagsChange = (e) => {
    const selectedTags = e.target.value.split(",");
    setTags(selectedTags);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      walkID: walkID,
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
      fileFormData.append("file", file);
      fileFormData.append("postID", postID); // Append postID here

      console.log(file);
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
      setFile(null);
      setContent("");
      setTags([]);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="Content"
          value={content}
          onChange={handleContentChange}
        />
        <input
          type="text"
          placeholder="Tags"
          value={tags.join(",")}
          onChange={handleTagsChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CreatePost;
