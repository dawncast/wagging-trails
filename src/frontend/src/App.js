import { BrowserRouter, Routes, Route } from "react-router-dom";
import DisplayOwner from "./pages/DisplayOwner";
import AddOwner from "./pages/AddOwner";
import UpdateOwner from "./pages/UpdateOwner";
import HomePage from "./pages/HomePage";
import CreatePost from "./components/SchedulingBar/NewPostForm";
import PostPage from "./pages/PostPage";
import FeedPage from "./pages/FeedPage";
import TagPage from "./pages/TagPage";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<FeedPage />}></Route>
          <Route path="/post/:ownerID/:postID" element={<PostPage />}></Route>
          <Route path="/post/:tag" element={<TagPage />}></Route>
          <Route path="/owners" element={<DisplayOwner />}></Route>
          <Route path="/add-owner" element={<AddOwner />}></Route>
          <Route path="/update-owner" element={<UpdateOwner />}></Route>
          <Route path="/create-post" element={<CreatePost />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
