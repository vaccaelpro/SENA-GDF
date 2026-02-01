import React, { useState } from "react";
import axios from "axios";
import "../../css/login.css";
import logoSena from "../../assets/img/logosena2.png";
import { Link } from "react-router-dom";

const Login = () => {
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [documento, setDocumento] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensaje("");

    if (!tipoDocumento) {
      setMensaje("Debes seleccionar el tipo de documento");
      return;
    }

    if (!documento) {
      setMensaje("Debes ingresar tu número de documento");
      return;
    }

    if (!contrasena) {
      setMensaje("Debes ingresar tu contraseña");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/api/auth/login", {
        tipo_documento: tipoDocumento,
        documento,
        contrasena,
      });

      const data = response.data;

      if (data.success) {
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        localStorage.setItem("rol", data.rol);

        if (data.rol === "USUARIO") window.location.href = "/Novedades_aprendiz";
        else if (data.rol === "ADMIN") window.location.href = "/Agregar_novedad";
        else setMensaje("Rol no autorizado");
      } else {
        setMensaje(data.message);
      }
    } catch (error) {
      console.error(error);

      if (error.response && error.response.data && error.response.data.message) {
        setMensaje(error.response.data.message);
      } else {
        setMensaje("Error del servidor. Por favor, intenta nuevamente.");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="login-container">
        <div className="left-login text-center">
          <p className="titulo">¿No tienes cuenta?</p>
          <p className="texto">Crea una aquí</p>
          <Link to="/registro" className="btn-custom btn-light">
            Crear Cuenta
          </Link>
        </div>

        <div className="right-login text-center">
          <img src={logoSena} alt="logo-sena" className="logosena mb-3" />
          <div className="fw-bold sena-title">SENA GDF</div>
          <div className="sena-subtitle mb-3">
            Inicia sesión con tu documento y contraseña
          </div>

          {mensaje && <div className="alert alert-danger">{mensaje}</div>}

          <form onSubmit={handleSubmit}>
            <select
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
              className="form-select custom-input mb-3"
              required
            >
              <option value="" disabled hidden>
                Selecciona tu documento
              </option>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="TI">Tarjeta de Identidad</option>
            </select>

            <div className="input-group mb-3">
              <span className="input-group-text">
                <ion-icon name="person-circle"></ion-icon>
              </span>
              <input
                type="text"
                className="form-control custom-input"
                placeholder="Número de documento"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                required
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text">
                <ion-icon name="lock-closed-outline"></ion-icon>
              </span>
              <input
                type="password"
                className="form-control custom-input"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>

            <Link to="/Repecuperar_contraseña" className="doc-link">
              ¿Olvidaste tu contraseña?
            </Link>

            <div className="mt-3">
              <button type="submit" className="btn-login w-100">
                Ingresar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

