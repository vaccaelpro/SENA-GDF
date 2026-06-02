import "../css/header_admin.css"
import React, { useState, useEffect } from "react";
import { BsPersonCircle, BsCaretDownFill } from "react-icons/bs";

const Header_admin = ({ nombre }) => {
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
    <div className="main-content">
      <div
        className="text-white p-4 d-flex justify-content-between align-items-center header-fixed"
        id="header"
      >
        <div>
          <h5 className="titulo">Bienvenid@, {nombreUsuario || "Admin"}</h5>
          <p>Mantente al día en la administración de tus ingresos</p>
        </div>

        <div className="d-flex align-items-center">
          <BsPersonCircle style={{ fontSize: "1.5rem" }} className="me-2" />
          <span>{nombreUsuario || "Admin"}</span>&nbsp;
          <BsCaretDownFill />
          <span className="ms-3">{time}</span>
        </div>
      </div>
    </div>
  );
};

export default Header_admin;
