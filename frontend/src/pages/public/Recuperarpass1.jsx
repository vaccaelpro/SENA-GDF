import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../../css/recuperarpass1.css";
import logoSena from "../../assets/img/logosena.png";

const RecuperarPassword = () => {
  const [correo, setCorreo] = useState("");
  const [cargando, setCargando] = useState(false);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const res = await fetch("http://localhost:3001/api/auth/recuperar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al enviar el correo");
      }

      Swal.fire({
        icon: "success",
        title: "¡Correo Enviado!",
        text: "Revisa tu bandeja de entrada. El enlace de recuperación es válido por 15 minutos.",
        confirmButtonColor: "#28a745"
      });
      setCorreo("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo procesar la solicitud",
        confirmButtonColor: "#28a745"
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="recuperar-wrapper">
      <div className="login-container">
        
        {/* LEFT COLUMN - OVERLAY STYLE */}
        <div className="left-login text-center">
          <h1>¿Ya recordaste?</h1>
          <p>Vuelve al inicio de sesión y continúa navegando en la plataforma.</p>
          <Link to="/" className="btn-custom ghost">
            Iniciar Sesión
          </Link>
        </div>

        {/* RIGHT COLUMN - FORM STYLE */}
        <div className="right-login text-center">
          <img src={logoSena} alt="logo-sena" className="logosena-auth mb-3" />
          <h1>RECUPERAR CONTRASEÑA</h1>
          <p>Ingresa tu correo electrónico para recibir el enlace de recuperación.</p>
          
          <form className="w-100 px-3" onSubmit={handleSubmit}>
            <div className="input-group-auth">
              <ion-icon name="mail-outline"></ion-icon>
              <input
                type="email"
                className="auth-input"
                placeholder="Correo electrónico (ejemplo@correo.com)"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-btn mt-3" disabled={cargando}>
              {cargando ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default RecuperarPassword;

