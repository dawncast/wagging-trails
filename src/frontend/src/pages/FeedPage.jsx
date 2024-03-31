import React, { useState, useEffect } from "react";
import SideBar from "../components/HomePage/Sidebar";
import PostCard from "../components/HomePage/Feed";

function FeedPage() {
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8800/posts/all`)
      .then((response) => response.json())
      .then((data) => setPost(data))
      .catch((error) => console.error("Error fetching post:", error));
  }, []);

  if (!post) {
    return <div>Loading...</div>;
  }

  console.log("Post state:", post);
  return (
    <div>
      <SideBar
        mainFeed={post.data.map((postData) => (
          <PostCard data={postData} />
        ))}
      />
    </div>
  );
}

export default FeedPage;
