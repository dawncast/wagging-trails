import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SideBarEdit from "../components/HomePage/SidebarEdit";
import Profile from "../components/Profile/Profile";
import SideBar from "../components/HomePage/Sidebar";

function ProfilePage() {
  const { ownerID } = useParams();
  const [posts, setPosts] = useState(null);
  const [friends, setFriends] = useState(null);
  const [dogs, setDogs] = useState(null);

  // fetches friend list
  useEffect(() => {
    fetch(`http://localhost:8800/friend-list/${ownerID}/fetch-friendship`)
      .then((response) => response.json())
      .then((data) => setFriends(data))
      .catch((error) => console.error("Error fetching friends:", error));
  }, [ownerID]);

  // fetches posts
  useEffect(() => {
    fetch(`http://localhost:8800/posts/${ownerID}/fetch-by-owner`)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching post:", error));
  }, [ownerID]);

  // fetches dogs
  useEffect(() => {
    fetch(`http://localhost:8800/dog/${ownerID}/get-dog-for`)
      .then((response) => response.json())
      .then((data) => setDogs(data))
      .catch((error) => console.error("Error fetching dogs:", error));
  }, [ownerID]);

  if (!posts || !dogs || !friends) {
    return <div>Loading...</div>;
  }

  console.log("Post state:", posts);
  console.log("Friend state:", friends);
  console.log("Dog state:", dogs);
  return (
    <div>
      <SideBarEdit
        mainFeed={<Profile posts={posts} friends={friends} dogs={dogs} />}
      />
    </div>
  );
}

export default ProfilePage;
