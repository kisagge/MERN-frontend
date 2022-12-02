import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import CreatePostPage from "./pages/CreatePost";

// pages & components
import HomePage from "./pages/Home";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePostPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
