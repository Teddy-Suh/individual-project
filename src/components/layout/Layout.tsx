import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Nav from "./Nav";

const Layout = () => {
  const location = useLocation();
  const navRequiredPaths = [
    "/",
    "/about",
    "/vote",
    "/board",
    "/chat",
    "/mypage",
  ];
  return (
    <>
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
      {navRequiredPaths.includes(location.pathname) && (
        <div className="pb-16">
          <Nav />
        </div>
      )}
    </>
  );
};

export default Layout;
