import Navbar from "../componentes/shared/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="layout-wrapper">
        <Outlet />
      </div>
    </>
  );
};

export default Layout
