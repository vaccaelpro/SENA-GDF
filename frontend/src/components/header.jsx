import "../css/header.css";
import { useEffect, useState } from "react";
import { FaUserCircle, FaCaretDown, FaBars } from "react-icons/fa";

const Header = ({ onToggleSidebar }) => {
  const [hora, setHora] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setHora(new Date().toLocaleTimeString());
    }, 1000);

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
    <div className="header-fixed text-white p-3 d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        {/* Toggle Sidebar Button - Visible on Mobile/Tablet */}
        <button className="menu-toggle-btn d-lg-none me-3" onClick={onToggleSidebar}>
          <FaBars />
        </button>
        
        <div className="header-greeting">
          <h5 className="titulo mb-0">Bienvenid@, {nombreUsuario || "Aprendiz"}</h5>
          <p className="subtitulo mb-0 d-none d-md-block">Mantente al día en la administración de tus ingresos</p>
        </div>
      </div>

      <div className="d-flex align-items-center header-user-clock">
        <div className="d-flex align-items-center header-profile-badge">
          <FaUserCircle className="me-2 header-icon" />
          <span className="profile-name d-none d-sm-inline">{nombreUsuario || "Aprendiz"}</span>
          <FaCaretDown className="ms-1 me-3 header-icon-small d-none d-sm-inline" />
        </div>
        <div className="header-divider d-none d-sm-block"></div>
        <span className="clock-span font-monospace">{hora}</span>
      </div>
    </div>
  );
};

export default Header;
