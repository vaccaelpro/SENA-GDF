import { useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import "../css/layout.css";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`layout-container ${sidebarOpen ? "sidebar-open" : ""}`}>
      {sidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-layout-wrapper">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="main-contente">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
