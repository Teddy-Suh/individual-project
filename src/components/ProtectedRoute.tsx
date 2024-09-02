import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ isVerified }: { isVerified: boolean }) => {
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);

  useEffect(() => {
    // 비로그인시 로그인 페이지로
    if (!state.user) {
      navigate("/login", { replace: true });
    }
    // 인증 유저 아니면 인증 페이지로
    if (isVerified && state.role !== "verifiedUser") {
      navigate("/mypage/verify", { replace: true });
    }
  });

  return <Outlet />;
};

export default ProtectedRoute;
