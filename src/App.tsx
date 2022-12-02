import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Navbar from "./components/Navbar";
import CreatePostPage from "./pages/CreatePost";

// pages & components
import HomePage from "./pages/Home";
import PostDetailPage from "./pages/PostDetail";
import PostListPage from "./pages/PostList";
import UpdatePostPage from "./pages/UpdatePost";

function App() {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/post/:id" element={<PostDetailPage />}></Route>
          {/* Post List Page */}
          <Route path="/post" element={<PostListPage />}></Route>
          {/* Update Post Page */}
          <Route path="/post/update/:id" element={<UpdatePostPage />}></Route>
        </Routes>
      </RecoilRoot>
    </BrowserRouter>
  );
}

export default App;
