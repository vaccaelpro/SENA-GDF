import Sidebar from "./sidebar";
import Header from "./header";
import "../css/layout.css"
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Sidebar />
      <Header />

      {}
      <main className="main-contente">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
