import "../../css/recuperarpass1.css";
import logoSena from "../../assets/img/logosena2.png";
import { useState } from "react";
import { Link } from "react-router-dom";

const RecuperarPassword = () => {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
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

      setMensaje("Revisa tu correo. El enlace dura 15 minutos.");
      setCorreo("");
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="login-container">
          <div className="left-login text-center">
            <p className="titulo">¿Ya recordaste?</p>
            <p className="texto">Vuelve al inicio de sesión</p>
            <Link to="/" className="btn-custom">
              Iniciar Sesión
            </Link>
          </div>

          <div className="right-login text-center">
            <img src={logoSena} alt="logo-sena" className="logosena mb-3" />
            <div className="fw-bold sena-title">RECUPERAR CONTRASEÑA</div>
            <br />
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control custom-input mb-4"
                placeholder="email@ejemplo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />

              <button type="submit" className="btn-login w-100" disabled={cargando}>
                {cargando ? "Enviando..." : "Enviar enlace"}
              </button>
            </form>

            {mensaje && <p className="mt-3 text-danger">{mensaje}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecuperarPassword;

