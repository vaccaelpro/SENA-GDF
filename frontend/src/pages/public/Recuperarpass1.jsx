import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { recuperarPassword } from "../../services/auth/auth.service";
import "../../css/recuperarpass1.css";
import logoSena from "../../assets/img/logosena.png";
import { validateEmail } from "../../utils/validators";

const RecuperarPassword = () => {
  const [correo, setCorreo] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [cargando, setCargando] = useState(false);

  const validate = (val) => {
    const err = validateEmail(val);
    setErrorCorreo(err);
    return err;
  };

  const handleCorreoChange = (e) => {
    const val = e.target.value;
    setCorreo(val);
    validate(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(correo);
    if (err) {
      Swal.fire({
        icon: "warning",
        title: "Correo Inválido",
        text: err,
        confirmButtonColor: "#28a745"
      });
      return;
    }

    setCargando(true);

    try {
      const data = await recuperarPassword(correo);

      Swal.fire({
        icon: "success",
        title: "¡Correo Enviado!",
        text: data.message || "Revisa tu bandeja de entrada. El enlace de recuperación es válido por 15 minutos.",
        confirmButtonColor: "#28a745"
      });
      setCorreo("");
      setErrorCorreo("");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "No se pudo procesar la solicitud";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
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
          
          <form className="w-100 px-3" onSubmit={handleSubmit} noValidate>
            <div className="input-group-auth">
              <ion-icon name="mail-outline"></ion-icon>
              <input
                type="email"
                className={`auth-input ${errorCorreo ? "input-error" : ""}`}
                placeholder="Correo electrónico (ejemplo@correo.com)"
                value={correo}
                onChange={handleCorreoChange}
                required
              />
            </div>
            {errorCorreo && <div className="field-error-msg">⚠️ {errorCorreo}</div>}

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

