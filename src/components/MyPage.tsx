import { useNavigate } from "react-router-dom";
import { logout } from "../firebase/auth";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import fetchNowPlayingMovies from "../api/tmdbApi";
import {
  createMovies,
  createSelectedMovie,
  deleteMovies,
} from "../firebase/movie";

const MyPage = () => {
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  const { nickname, role } = state;

  const handleSelectMovie = async () => {
    try {
      createSelectedMovie();
      console.log("이 주의 영화 선정 성공");
      deleteMovies();
      console.log("영화 목록 지우기 성공");
    } catch (error) {
      console.error("이 주의 영화 선정 실패", error);
    }
  };

  const handleUpdateMovies = async () => {
    try {
      const MoviesData = await fetchNowPlayingMovies();
      console.log("Tmdb에서 영화 데이터 받아오기 성공", MoviesData);

      await createMovies(MoviesData);
      console.log("영화 데이터 저장 성공!");
    } catch (error) {
      console.error("영화 업데이트 실패", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log("로그아웃 성공");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패", error);
    }
  };

  return (
    <>
      <div className="mx-auto mb-10 border-2 h-96 card w-96 border-secondary">
        <div className="card-body">
          <h2 className="card-title text-secondary">{nickname} 님</h2>
          <p className="text-xl">안녕하세요</p>
          <p className="text-lg">이번 주 영화는 보셨나요?</p>
          <div className="card-actions">
            <button
              className="mb-3 btn btn-outline btn-secondary w-80"
              onClick={() => {
                navigate("/mypage/nickname");
              }}
            >
              닉네임 수정
            </button>
            <button
              className="mb-3 btn btn-outline btn-secondary w-80"
              onClick={() => {
                navigate("/mypage/verify");
              }}
            >
              영화표 인증하기
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-error btn-outline w-80"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      {role === "admin" && (
        <div className="mx-auto border-2 card w-96 border-secondary">
          <div className="card-body">
            <div className="mb-6 card-title text-secondary">관리자 메뉴</div>
            <button
              onClick={handleSelectMovie}
              className="mb-3 btn btn-outline btn-secondary"
            >
              이 주의 영화 선정
            </button>
            <button
              onClick={handleUpdateMovies}
              className="mb-3 btn btn-outline btn-secondary"
            >
              다음 주 영화 업데이트
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MyPage;
