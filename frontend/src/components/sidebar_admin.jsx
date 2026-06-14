import "../css/sidebar_admin.css"
import logoSena from "../assets/img/logosena2.png";
import {
  BsNewspaper,
  BsPersonFillGear,
  BsDownload,
  BsChatRightTextFill,
  BsPeopleFill,
  BsGearFill,
  BsBoxArrowLeft,
  BsX
} from "react-icons/bs";
import { Link } from "react-router-dom";

const Sidebar_administrador = ({ isOpen, onClose }) => {
  return (
    <div className={`sidebar d-flex flex-column p-3 ${isOpen ? "open" : ""}`}>
      {/* Mobile close button */}
      <button className="sidebar-close-btn d-lg-none" onClick={onClose}>
        <BsX />
      </button>

      <div className="text-center mb-4 mt-2">
        <img src={logoSena} alt="SENA" className="img-fluid mb-2 logo-sena" />
        <h5 className="titulo">SENA GDF</h5>
        <p className="text-white-50 mb-0">Administrador</p>
      </div>
      <hr />
      
      <div className="flex-grow-1 d-flex flex-column justify-content-center">
        <div className="menu-item">
          <a href="#" onClick={(e) => e.preventDefault()}>
            <BsNewspaper /> Novedades
          </a>
          <div className="submenu">
            <Link to="/Agregar_novedad" onClick={onClose}>Agregar Novedades</Link>
            <Link to="/Eliminar_novedad" onClick={onClose}>Eliminar Novedades</Link>
          </div>
        </div>

        <div className="menu-item" onClick={onClose}>
          <Link to="/Tabla_gestion_usuarios">
            <BsPersonFillGear /> Gestión de Usuarios
          </Link>
        </div>

        <div className="menu-item">
          <a href="#" onClick={(e) => e.preventDefault()}>
            <BsDownload /> Exportación de Datos
          </a>
          <div className="submenu">
            <Link to="/Exportar_finanzas" onClick={onClose}>Finanzas</Link>
            <Link to="/Exportar_personal" onClick={onClose}>Personal</Link>
          </div>
        </div>

        <div className="menu-item">
          <a href="#" onClick={(e) => e.preventDefault()}>
            <BsChatRightTextFill /> Encuestas y Análisis
          </a>
          <div className="submenu">
            <Link to="/Encuestas" onClick={onClose}>Encuestas</Link>
            <Link to="/Analisis" onClick={onClose}>Análisis</Link>
          </div>
        </div>

        <div className="menu-item" onClick={onClose}>
          <Link to="/Lista_grupos">
            <BsPeopleFill /> Grupos
          </Link>
        </div>
      </div>

      <div className="bottom-links mt-auto">
        <hr />
        <div onClick={onClose}>
          <Link to="#">
            <BsGearFill /> Ajustes
          </Link>
        </div>
        <div onClick={onClose}>
          <Link to="/" className="cerrar">
            <BsBoxArrowLeft /> Cerrar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar_administrador;
