import { BrowserRouter, Routes, Route } from "react-router-dom";
import DisplayOwner from "./pages/DisplayOwner";
import AddOwner from "./pages/AddOwner";
import UpdateOwner from "./pages/UpdateOwner";
import HomePage from "./pages/HomePage";
import Upload from "./components/SchedulingBar/UploadMedia";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<HomePage />}></Route>
          <Route path="/owners" element={<DisplayOwner />}></Route>
          <Route path="/add-owner" element={<AddOwner />}></Route>
          <Route path="/update-owner" element={<UpdateOwner />}></Route>
          <Route path="/file-upload" element={<Upload />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
