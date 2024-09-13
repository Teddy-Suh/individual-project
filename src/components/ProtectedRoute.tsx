import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";

const ProtectedRoute = ({
  requireLogin = false,
  requireVerification = false,
}: {
  requireLogin?: boolean;
  requireVerification?: boolean;
}) => {
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);

  useEffect(() => {
    // 비 로그인 사용자만 접근 가능
    if (!requireLogin && state.user) {
      navigate("/", { replace: true });
    }
    // 로그인 사용자만 접근가능
    if (requireLogin && !state.user) {
      navigate("/login", { replace: true });
    }
    // 인증 유저만 접근 가능 아니면 인증 페이지로 (채팅에서 쓸 예정)
    if (requireVerification && state.role !== "verifiedUser") {
      navigate("/mypage/verify", { replace: true });
    }
  });

  const outletContext = useOutletContext();

  return outletContext ? <Outlet context={outletContext} /> : <Outlet />;
};

export default ProtectedRoute;
