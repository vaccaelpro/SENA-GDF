import "../css/header.css";
import { useEffect, useState } from "react";
import { FaUserCircle, FaCaretDown } from "react-icons/fa";

const Header = () => {
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
    <div className="text-white p-4 d-flex justify-content-between align-items-center header-fixed">
      <div>
        <h5 className="titulo">Bienvenido, {nombreUsuario || "Aprendiz"}</h5>
        <p>Mantente al día en la administración de tus ingresos</p>
      </div>

      <div className="d-flex align-items-center">
        <FaUserCircle className="me-2 header-icon" />
        <span>{nombreUsuario || "Aprendiz"}</span>
        <FaCaretDown className="ms-1 me-3 header-icon-small" />
        <span>{hora}</span>
      </div>
    </div>
  );
};

export default Header;

