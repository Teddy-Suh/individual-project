import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const pageTitles: Record<string, string> = {
  "/signup": "Sign Up",
  "/login": "Log In",
  "/": "Moveek",
  "/board": "Board",
  "/vote": "Vote",
  "/mypage": "My Page",
  "/chat": "Chat",
  "/about": "About",
};

const Header = () => {
  const { state } = useContext(AuthContext);
  const { user } = state;
  const navigate = useNavigate();
  const location = useLocation();
  const noBackButtonPaths = ["/", "/board", "/vote", "/chat", "/mypage"];
  const [pathColor, setPathColor] = useState("");

  const getPathColor = (pathname: string) => {
    switch (pathname) {
      case "/board":
        return "accent";
      case "/vote":
        return "error";
      case "/chat":
        return "success";
      case "/mypage":
      case "/mypage/nickname":
      case "/mypage/verify":
        return "secondary";
      default:
        return "primary";
    }
  };

  useEffect(() => {
    setPathColor(getPathColor(location.pathname));
  }, [location.pathname]);

  const handleCreateClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!user) {
      e.preventDefault(); // ProtectedRoute로 로그인 페이지로 바로 리디렉션 하는거 방지
      // 모달 띄우기
      const loginModal = document.getElementById("login_modal");
      (loginModal as HTMLDialogElement).showModal();
    }
  };

  return (
    <header className="fixed top-0 z-50 h-16 max-w-md px-5 mx-auto navbar bg-base-100">
      <div className="flex-none">
        {!noBackButtonPaths.includes(location.pathname) && (
          <button
            onClick={() => navigate(-1)}
            className={`p-0 pr-3 btn btn-outline btn-${pathColor} border-0`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="flex-1">
        <h1 className={`text-xl font-bold text-${pathColor}`}>
          {pageTitles[location.pathname] || ""}
        </h1>
      </div>
      {location.pathname === "/board" && (
        <div className="flex flex-none gap-5">
          <Link
            to="/board/search"
            className="p-0 border-0 btn btn-outline btn-accent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="size-6"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </Link>
          <Link
            to="/board/post/create"
            className="p-0 border-0 btn btn-outline btn-accent"
            onClick={handleCreateClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="size-6"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
