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
import PostLayout from "../components/board/post/PostLayout";
import Modal from "../components/common/Modal";

const Router = () => {
  return (
    <BrowserRouter>
      <Modal />

      <Routes>
        {/* 게시글 검색 */}
        <Route path="/board/search" element={<BoardSearchPage />} />

        {/* 게시글 레이아웃 */}
        <Route path="/board/post/" element={<PostLayout />}>
          <Route path=":postId" element={<PostPage />} />
          <Route path=":postId/edit" element={<PostEditPage />} />
          {/* 로그인 회원만 접근 가능 */}
          <Route element={<ProtectedRoute requireLogin={true} />}>
            <Route path="create" element={<PostCreatePage />} />
          </Route>
        </Route>

        {/* 일반 레이아웃 */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="board" element={<BoardPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="vote" element={<VotePage />} />

          {/* 비로그인 회원만 접근 가능 */}
          <Route element={<ProtectedRoute requireLogin={false} />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
          </Route>

          {/* 로그인 회원만 접근 가능 */}
          <Route element={<ProtectedRoute requireLogin={true} />}>
            <Route path="mypage">
              <Route index element={<MyPagePage />} />
              <Route path="nickname" element={<NicknamePage />} />
              <Route path="verify" element={<VerifyPage />} />
            </Route>
          </Route>

          {/* 인증된 회원만 접근 가능 */}
          <Route
            element={
              <ProtectedRoute requireLogin={true} requireVerification={true} />
            }
          >
            <Route path="chat/chatroom" element={<ChatRoomPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
