import "../css/sidebar_admin.css"
import logoSena from "../assets/img/logosena2.png";
import {
  BsNewspaper,
  BsPersonFillGear,
  BsDownload,
  BsChatRightTextFill,
  BsPeopleFill,
  BsGearFill,
  BsBoxArrowLeft
} from "react-icons/bs";
import { Link } from "react-router-dom";

const Sidebar_administrador = () => {
  return (
    <>
      <br />
      <div className="sidebar d-flex flex-column p-3">
        <div className="text-center mb-4">
          <img src={logoSena} alt="SENA" className="img-fluid mb-2 logo-sena" />
          <h5 className="titulo">SENA GDF</h5>
          <p>Administrador</p>
        </div>
        <hr />
        <div className="flex-grow-1 d-flex flex-column justify-content-center">
          <div className="menu-item">
            <a href="#">
              <BsNewspaper /> Novedades
            </a>
            <div className="submenu">
              <Link to="/Agregar_novedad">Agregar Novedades</Link>
              <Link to="/Eliminar_novedad">Eliminar Novedades</Link>
            </div>
          </div>

          <div className="menu-item">
            <Link to="/Tabla_gestion_usuarios">
              <BsPersonFillGear /> Gestión de Usuarios
            </Link>
          </div>

          <div className="menu-item">
            <a href="#">
              <BsDownload /> Exportación de Datos
            </a>
            <div className="submenu">
              <Link to="/Exportar_finanzas">Finanzas</Link>
              <Link to="/Exportar_personal">Personal</Link>
            </div>
          </div>

          <div className="menu-item">
            <a href="#">
              <BsChatRightTextFill /> Encuestas y Análisis
            </a>
            <div className="submenu">
              <Link to="/Encuestas">Encuestas</Link>
              <Link to="/Analisis">Análisis</Link>
            </div>
          </div>

          <div className="menu-item">
            <Link to="/Lista_grupos">
              <BsPeopleFill /> Grupos
            </Link>
          </div>
        </div>

        <div className="bottom-links mt-auto">
          <hr />
          <Link to="#">
            <BsGearFill /> Ajustes
          </Link>
          <Link to="/" className="cerrar">
            <BsBoxArrowLeft /> Cerrar Sesión
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar_administrador;
