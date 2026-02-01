import "../css/header.css";
import { useEffect, useState } from "react";
import { FaUserCircle, FaCaretDown } from "react-icons/fa";

const Header = () => {
  const [hora, setHora] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setHora(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-white p-4 d-flex justify-content-between align-items-center header-fixed">
      <div>
        <h5 className="titulo">Bienvenido, Santiago Vacca</h5>
        <p>Mantente al día en la administración de tus ingresos</p>
      </div>

      <div className="d-flex align-items-center">
        <FaUserCircle className="me-2 header-icon" />
        <span>Aprendiz</span>
        <FaCaretDown className="ms-1 me-3 header-icon-small" />
        <span>{hora}</span>
      </div>
    </div>
  );
};

export default Header;

