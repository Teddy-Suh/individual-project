import { Link, useNavigate } from "react-router-dom";
import { logout } from "../firebase/auth";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const MyPage = () => {
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  const { nickname } = state;

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
      <div>
        <b>{nickname} 님 안녕하세요</b>
        <Link to={"/nickname"}>닉네임 수정</Link>
      </div>
      <button onClick={handleLogout}>로그아웃</button>
    </>
  );
};

export default MyPage;
