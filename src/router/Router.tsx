import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import VotePage from "../pages/VotePage";
import BoardPage from "../pages/BoardPage";
import PostPage from "../pages/PostPage";
import PostCreatePage from "../pages/PostCreatePage";
import PostEditPage from "../pages/PostEditPage";
import BoardSearchPage from "../pages/BoardSearchPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import NicknamePage from "../pages/NicknamePage";
import ChatPage from "../pages/ChatPage";
import MyPagePage from "../pages/MyPagePage";
import ChatRoomPage from "../pages/ChatRoomPage";
import ErrorPage from "../pages/ErrorPage";
import VerifyPage from "../pages/VerifyPage";
import ProtectedRoute from "../components/ProtectedRoute";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        // nav있는 페이지
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="About" element={<AboutPage />} />
          <Route path="vote" element={<VotePage />} />
          <Route path="board" element={<BoardPage />} />
          <Route path="*" element={<ErrorPage />} />
          <Route element={<ProtectedRoute isVerified={false} />}>
            <Route path="mypage" element={<MyPagePage />} />
          </Route>
          <Route element={<ProtectedRoute isVerified={true} />}>
            <Route path="chat" element={<ChatPage />} />
          </Route>
        </Route>
        // nav 없는 페이지
        <Route element={<ProtectedRoute isVerified={false} />}>
          <Route path="/nickname" element={<NicknamePage />} />
          <Route path="/mypage/verify" element={<VerifyPage />} />
          <Route path="/board/create" element={<PostCreatePage />} />
        </Route>
        <Route element={<ProtectedRoute isVerified={true} />}>
          <Route path="/chat/chatroom" element={<ChatRoomPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/board/search" element={<BoardSearchPage />} />
        <Route path="/board/:id" element={<PostPage />} />
        <Route path="/board/:id/edit" element={<PostEditPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
