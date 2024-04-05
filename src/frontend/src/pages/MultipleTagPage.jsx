import React, { useState, useEffect } from "react";
import PostCard from "../components/HomePage/Feed";
import SideBarEdit from "../components/HomePage/SidebarEdit";

function MultiTagPage(tags) {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const sendTags = encodeURIComponent(JSON.stringify(tags));
    fetch(`http://localhost:8800/tagged-in/posts-with-tags?tags=${sendTags}`)
      .then((response) => response.json())
      .then((data) => setPost(data))
      .catch((error) => console.error("Error fetching post:", error));
  }, [tags]);

  if (!post) {
    return <div>Loading...</div>;
  }

  console.log("Post state:", post);
  return (
    <div>
      <SideBarEdit
        mainFeed={post.data.map((postData) => (
          <PostCard data={postData} />
        ))}
      />
    </div>
  );
}

export default MultiTagPage;
