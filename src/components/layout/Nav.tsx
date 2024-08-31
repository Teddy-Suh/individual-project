import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
      <li style={{ marginRight: '20px' }}>
        <Link to="/">홈</Link>
      </li>
      <li style={{ marginRight: '20px' }}>
        <Link to="/movie-info">영화</Link>
      </li>
      <li style={{ marginRight: '20px' }}>
        <Link to="/board">게시판</Link>
      </li>
      <li style={{ marginRight: '20px' }}>
        <Link to="/chat">채팅</Link>
      </li>
      <li>
        <Link to="/mypage">마이페이지</Link>
      </li>
    </ul>
  );
};

export default Nav;
