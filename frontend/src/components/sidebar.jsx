import "../css/sidebar.css";
import logoSena from "../assets/img/logosena2.png";
import { Link } from "react-router-dom";

import {
  FaNewspaper,
  FaClipboardCheck,
  FaRobot,
  FaPiggyBank,
  FaFileAlt,
  FaUsers,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="sidebar d-flex flex-column p-3">
      <div className="text-center mb-4">
        <img
          src={logoSena}
          alt="SENA"
          className="img-fluid mb-2"
          id="logosena2"
        />
        <h5 className="titulo">SENA GDF</h5>
        <p>Aprendiz</p>
      </div>

      <hr />

      <div className="menu-container flex-grow-1 d-flex flex-column justify-content-center">
        <div className="menu-item">
          <Link to="/Novedades_aprendiz">
            <FaNewspaper className="menu-icon" /> Novedades
          </Link>
        </div>

        <div className="menu-item">
          <Link to="/Satisfaccion encuestas">
            <FaClipboardCheck className="menu-icon" /> Satisfacción Encuestas
          </Link>
        </div>

        <div className="menu-item">
          <Link to="/IAFinance">
            <FaRobot className="menu-icon" /> IA Finance
          </Link>
        </div>

        <div className="menu-item">
          <Link to="/Metas_de_ahorro">
            <FaPiggyBank className="menu-icon" /> Metas de Ahorro
          </Link>
        </div>

        <div className="menu-item">
          <Link to="/IADocument">
            <FaFileAlt className="menu-icon" /> IA Guía Formularios
          </Link>
        </div>

        <div className="menu-item">
          <Link to="/Mi_grupo">
            <FaUsers className="menu-icon" /> Mi Grupo
          </Link>
        </div>
      </div>

      <div className="bottom-links mt-auto">
        <hr />

        <Link to="/ajustes">
          <FaCog className="menu-icon" /> Ajustes
        </Link>

        <Link to="/" className="cerrar">
          <FaSignOutAlt className="menu-icon" /> Cerrar Sesión
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

