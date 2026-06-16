import "../css/header_admin.css"
import React, { useState, useEffect } from "react";
import { BsPersonCircle, BsCaretDownFill, BsList } from "react-icons/bs";

const Header_admin = ({ onToggleSidebar }) => {
  const [time, setTime] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();

    const usuarioStorage = localStorage.getItem("usuario");
    if (usuarioStorage) {
      try {
        const usuario = JSON.parse(usuarioStorage);
        setNombreUsuario(`${usuario.primer_nombre || ""} ${usuario.primer_apellido || ""}`.trim());
      } catch (error) {
        console.error("Error parseando usuario", error);
      }
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="header-fixed text-white p-3 d-flex justify-content-between align-items-center" id="header">
      <div className="d-flex align-items-center">
        {/* Toggle Sidebar Button - Visible on Mobile/Tablet */}
        <button className="menu-toggle-btn d-lg-none me-3" onClick={onToggleSidebar}>
          <BsList />
        </button>

        <div className="header-greeting">
          <h5 className="titulo mb-0">Bienvenid@, {nombreUsuario || "Admin"}</h5>
          <p className="subtitulo mb-0 d-none d-md-block">Mantente al día en la administración de tus ingresos</p>
        </div>
      </div>

      <div className="d-flex align-items-center header-user-clock">
        <div className="d-flex align-items-center header-profile-badge">
          <BsPersonCircle style={{ fontSize: "1.3rem" }} className="me-2" />
          <span className="profile-name d-none d-sm-inline">{nombreUsuario || "Admin"}</span>&nbsp;
          <BsCaretDownFill className="d-none d-sm-inline" />
        </div>
        <div className="header-divider d-none d-sm-block"></div>
        <span className="clock-span font-monospace">{time}</span>
      </div>
    </div>
  );
};

export default Header_admin;
