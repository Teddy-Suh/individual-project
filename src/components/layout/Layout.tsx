import { Outlet } from "react-router-dom";
import Header from "./Header";
import Nav from "./Nav";

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Nav />
    </>
  );
};

export default Layout;
