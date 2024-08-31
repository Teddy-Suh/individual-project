import { Outlet } from 'react-router-dom';
import Nav from './Nav';

const Layout = () => {
  return (
    <>
      <Outlet />
      <Nav />
    </>
  );
};

export default Layout;
