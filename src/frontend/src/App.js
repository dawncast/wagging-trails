import { BrowserRouter, Routes, Route } from "react-router-dom";
import DisplayOwner from "./pages/DisplayOwner";
import AddOwner from "./pages/AddOwner";
import UpdateOwner from "./pages/UpdateOwner";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <div>
       <HomePage></HomePage>
      <BrowserRouter>
        <Routes>
          <Route path="/owners" element={<DisplayOwner />}></Route>
          <Route path="/add-owner" element={<AddOwner />}></Route>
          <Route path="/update-owner" element={<UpdateOwner />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
