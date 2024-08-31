import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';

const MyPage = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // 로그아웃 성공 시 Context에서 사용자 정보 제거
      dispatch({
        type: 'LOGOUT',
        payload: null,
      });
      // 홈 페이지나 로그인 페이지로 리디렉션
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      <h1>My Page</h1>
      <button onClick={handleLogout}>로그아웃</button>
    </>
  );
};

export default MyPage;
