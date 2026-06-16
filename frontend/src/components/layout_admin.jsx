import { useState } from "react";
import Sidebar_admin from "./sidebar_admin";
import Header_admin from "./header_admin";
import "../css/layout_admin.css";
import { Outlet } from "react-router-dom";

const Layout_admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`layout-container ${sidebarOpen ? "sidebar-open" : ""}`}>
      {sidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
      <Sidebar_admin isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-layout-wrapper">
        <Header_admin onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="main-contente">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout_admin;