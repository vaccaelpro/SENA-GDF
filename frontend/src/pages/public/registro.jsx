import { Link } from "react-router-dom";
import "../../css/registro.css";
import logoSena from "../../assets/img/logosena.png";
import { useState } from "react";
import axios from "axios";

const Registro = () => {
  const [verPass, setVerPass] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const [form, setForm] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    tipo_documento: "",
    documento: "",
    celular: "",
    correo_electronico: "",
    contrasena: "",
    grupo_formacion: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setRegistroExitoso(false);

    if (form.contrasena.length < 8) {
      setMensaje("La contraseña debe de ser mayor o igual a ocho digitos");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3001/api/auth/register",
        form
      );

      setRegistroExitoso(true);

      setTimeout(() => {
        window.location.href = "/";
      }, 3000);

    } catch (error) {
      setMensaje(
        error.response?.data?.message || "Error al registrar usuario"
      );
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center">
      <div className="registro-container">
        <div className="row g-0 h-100">

          <div className="col-md-4 left-panel text-center">
            <img src={logoSena} className="logosena mb-3" alt="logo-sena" />
            <h4 className="titulo">¿Ya tienes una cuenta?</h4>
            <p className="texto">Inicia sesión aquí</p>

            <Link to="/" className="btn-custom btn-light">
              Iniciar Sesión
            </Link>
          </div>

          <div className="col-md-8 right-panel">
            <h4 className="mb-4 titulo">Crea Tu Cuenta</h4>

            {registroExitoso && (
              <div className="alert alert-success">
                Usuario registrado exitosamente, serás redirigido al login
              </div>
            )}

            {mensaje && <div className="alert alert-danger">{mensaje}</div>}

            <form onSubmit={handleSubmit} className="form-registro">

              <div className="row mb-3">
                <div className="col">
                  <input
                    type="text"
                    name="primer_nombre"
                    value={form.primer_nombre}
                    onChange={handleChange}
                    className="form-control custom-input"
                    placeholder="Primer Nombre"
                    required
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    name="segundo_nombre"
                    value={form.segundo_nombre}
                    onChange={handleChange}
                    className="form-control custom-input"
                    placeholder="Segundo Nombre"
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <input
                    type="text"
                    name="primer_apellido"
                    value={form.primer_apellido}
                    onChange={handleChange}
                    className="form-control custom-input"
                    placeholder="Primer Apellido"
                    required
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    name="segundo_apellido"
                    value={form.segundo_apellido}
                    onChange={handleChange}
                    className="form-control custom-input"
                    placeholder="Segundo Apellido"
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <select
                    name="tipo_documento"
                    value={form.tipo_documento}
                    onChange={handleChange}
                    className="form-select custom-input"
                    required
                  >
                    <option value="" disabled>
                      Tipo de Documento
                    </option>
                    <option value="CC">Cédula</option>
                    <option value="TI">Tarjeta de Identidad</option>
                  </select>
                </div>
                <div className="col">
                  <input
                    type="text"
                    name="documento"
                    value={form.documento}
                    onChange={handleChange}
                    className="form-control custom-input"
                    placeholder="N° de Documento"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  name="celular"
                  value={form.celular}
                  onChange={handleChange}
                  className="form-control custom-input"
                  placeholder="Número de Celular"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  name="correo_electronico"
                  value={form.correo_electronico}
                  onChange={handleChange}
                  className="form-control custom-input"
                  placeholder="Correo Electrónico"
                  required
                />
              </div>

              <div className="mb-2">
                <label className="text-contraseña">
                  La contraseña debe tener mínimo 8 caracteres.
                </label>
              </div>

              <div className="mb-3 position-relative">
                <input
                  type={verPass ? "text" : "password"}
                  name="contrasena"
                  value={form.contrasena}
                  onChange={handleChange}
                  className="form-control custom-input"
                  placeholder="Contraseña"
                  minLength={8}
                  required
                />
                <span
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                  onClick={() => setVerPass(!verPass)}
                >
                  👁️
                </span>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <input
                    type="text"
                    name="grupo_formacion"
                    value={form.grupo_formacion}
                    onChange={handleChange}
                    className="form-control custom-input"
                    placeholder="N° de Ficha (Grupo de Formación)"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-login w-100">
                Registrar
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;


