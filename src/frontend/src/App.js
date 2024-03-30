import { BrowserRouter, Routes, Route } from "react-router-dom";
import DisplayOwner from "./pages/DisplayOwner";
import AddOwner from "./pages/AddOwner";
import UpdateOwner from "./pages/UpdateOwner";
import HomePage from "./pages/HomePage";
import CreatePost from "./components/SchedulingBar/NewPostForm";
import Login from "./components/Login/LoginForm";
import Register from "./components/Login/RegisterForm";
import PostPage from "./pages/PostPage";


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
         <Route path="/login" element={<Login />}></Route>
         <Route path="/register" element={<Register />}></Route>
          <Route path="/home" element={<HomePage />}></Route>
          <Route path="/post/:ownerID/:postID" element={<PostPage />}></Route>
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
