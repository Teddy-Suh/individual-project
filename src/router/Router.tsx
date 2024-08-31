import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';
import MovieInfo from '../pages/MovieInfo';
import Board from '../pages/Board';
import Chat from '../pages/Chat';
import Post from '../pages/Post';
import MyPage from '../pages/MyPage';
import Error from '../pages/Error';
import Nickname from '../components/auth/Nickname';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="movie-info" element={<MovieInfo />} />
          <Route path="board" element={<Board />} />
          <Route path="board/:id" element={<Post />} />
          <Route path="chat" element={<Chat />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="Error" element={<Error />} />
          <Route path="nickname" element={<Nickname />} />
        </Route>
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
