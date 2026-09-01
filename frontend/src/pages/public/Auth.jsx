import React, { useState, useEffect } from "react";
import { login, registrar } from "../../services/auth/auth.service";
import Swal from "sweetalert2";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../css/auth.css";
import logoSena from "../../assets/img/logosena.png";
import {
  validateOnlyLetters,
  validateOptionalLetters,
  validateOnlyNumbers,
  validateEmail,
  validatePassword
} from "../../utils/validators";

// ─── Helpers de alertas ──────────────────────────────────────────────────────
const showToast = (icon, title) =>
  Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    didOpen: (t) => {
      t.onmouseenter = Swal.stopTimer;
      t.onmouseleave = Swal.resumeTimer;
    },
  }).fire({ icon, title });

const showAlert = (icon, title, text) =>
  Swal.fire({
    icon,
    title,
    text,
    confirmButtonColor: "#28a745",
  });

// ─── Componente ──────────────────────────────────────────────────────────────
const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    setIsSignUp(location.pathname === "/Registro");
  }, [location.pathname]);

  // ────────────── LOGIN ──────────────────────────────────────────────────────
  const [loginForm, setLoginForm] = useState({
    tipo_documento: "",
    documento: "",
    contrasena: "",
  });
  const [loginErrors, setLoginErrors] = useState({});

  const validateLoginField = (name, value) => {
    let err = "";
    if (name === "tipo_documento" && !value) err = "Selecciona tu tipo de documento.";
    if (name === "documento") err = validateOnlyNumbers(value, "El documento", 6, 11);
    if (name === "contrasena" && !value) err = "La contraseña es obligatoria.";
    setLoginErrors((prev) => ({ ...prev, [name]: err }));
    return err;
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
    validateLoginField(name, value);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const errDoc = validateLoginField("documento", loginForm.documento);
    const errTipo = validateLoginField("tipo_documento", loginForm.tipo_documento);
    const errPass = validateLoginField("contrasena", loginForm.contrasena);

    if (errDoc || errTipo || errPass) {
      showToast("warning", "Corrige los errores antes de continuar.");
      return;
    }

    try {
      const data = await login(loginForm);
      if (data.success) {
        // Guardamos el token de JWT en el local storage, así lo guardamos cada que el inicio de sesión esté bien
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("usuario", JSON.stringify(data.usuario));
        sessionStorage.setItem("rol", data.rol);
        showToast("success", "¡Inicio de sesión exitoso!");
        setTimeout(() => {
          if (data.rol === "USUARIO") navigate("/Novedades_aprendiz");
          else if (data.rol === "ADMIN") navigate("/Agregar_novedad");
          else showAlert("error", "Acceso denegado", "Rol no autorizado.");
        }, 1500);
      } else {
        showAlert("error", "Error al iniciar sesión", data.message || "Credenciales incorrectas.");
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Error del servidor. Intenta de nuevo.";
      showAlert("error", "Oops...", msg);
    }
  };

  // ────────────── REGISTRO ───────────────────────────────────────────────────
  const [verPass, setVerPass] = useState(false);
  const [registerForm, setRegisterForm] = useState({
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
  const [registerErrors, setRegisterErrors] = useState({});

  const validateRegisterField = (name, value) => {
    let err = "";
    if (name === "primer_nombre") err = validateOnlyLetters(value, "El primer nombre");
    if (name === "segundo_nombre") err = validateOptionalLetters(value);
    if (name === "primer_apellido") err = validateOnlyLetters(value, "El primer apellido");
    if (name === "segundo_apellido") err = validateOptionalLetters(value);
    if (name === "tipo_documento" && !value) err = "Selecciona un tipo de documento.";
    if (name === "documento") err = validateOnlyNumbers(value, "El documento", 6, 11);
    if (name === "celular") err = validateOnlyNumbers(value, "El celular", 10, 10);
    if (name === "correo_electronico") err = validateEmail(value);
    if (name === "contrasena") err = validatePassword(value);
    if (name === "grupo_formacion") err = validateOnlyNumbers(value, "La ficha (grupo)", 4, 10);

    setRegisterErrors((prev) => ({ ...prev, [name]: err }));
    return err;
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm({ ...registerForm, [name]: value });
    validateRegisterField(name, value);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const fieldsToValidate = [
      "primer_nombre",
      "segundo_nombre",
      "primer_apellido",
      "segundo_apellido",
      "tipo_documento",
      "documento",
      "celular",
      "correo_electronico",
      "contrasena",
      "grupo_formacion"
    ];

    let hasError = false;
    fieldsToValidate.forEach((field) => {
      const err = validateRegisterField(field, registerForm[field]);
      if (err) hasError = true;
    });

    if (hasError) {
      showAlert("warning", "Datos inválidos", "Revisa los campos señalados en rojo antes de registrarte.");
      return;
    }

    try {
      await registrar(registerForm);
      await showAlert("success", "¡Registro Exitoso!", "Tu cuenta fue creada. Ahora puedes iniciar sesión.");
      setIsSignUp(false);
      setRegisterForm({
        primer_nombre: "", segundo_nombre: "", primer_apellido: "", segundo_apellido: "",
        tipo_documento: "", documento: "", celular: "", correo_electronico: "",
        contrasena: "", grupo_formacion: "",
      });
      setRegisterErrors({});
    } catch (err) {
      const msg = err.response?.data?.message || "Error al registrar usuario.";
      showAlert("error", "Error en el registro", msg);
    }
  };

  // ────────────── RENDER ─────────────────────────────────────────────────────
  return (
    <div className="auth-wrapper">
      <div className={`auth-container ${isSignUp ? "right-panel-active" : ""}`}>

        {/* ── FORMULARIO DE REGISTRO ── */}
        <div className="form-container sign-up-container">
          <form className="auth-form" onSubmit={handleRegisterSubmit} noValidate>
            <h1>Crea Tu Cuenta</h1>
            <p>Ingresa tus datos para registrarte en SENA GDF</p>

            <div className="scroll-form">
              <div className="row g-2">
                <div className="col-md-6">
                  <div className="input-group-auth">
                    <ion-icon name="person-outline"></ion-icon>
                    <input
                      type="text"
                      name="primer_nombre"
                      value={registerForm.primer_nombre}
                      onChange={handleRegisterChange}
                      className={`auth-input ${registerErrors.primer_nombre ? "input-error" : ""}`}
                      placeholder="Primer Nombre"
                      required
                    />
                  </div>
                  {registerErrors.primer_nombre && (
                    <div className="field-error-msg">⚠️ {registerErrors.primer_nombre}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <div className="input-group-auth">
                    <ion-icon name="person-outline"></ion-icon>
                    <input
                      type="text"
                      name="segundo_nombre"
                      value={registerForm.segundo_nombre}
                      onChange={handleRegisterChange}
                      className={`auth-input ${registerErrors.segundo_nombre ? "input-error" : ""}`}
                      placeholder="Segundo Nombre (Opcional)"
                    />
                  </div>
                  {registerErrors.segundo_nombre && (
                    <div className="field-error-msg">⚠️ {registerErrors.segundo_nombre}</div>
                  )}
                </div>
              </div>

              <div className="row g-2">
                <div className="col-md-6">
                  <div className="input-group-auth">
                    <ion-icon name="people-outline"></ion-icon>
                    <input
                      type="text"
                      name="primer_apellido"
                      value={registerForm.primer_apellido}
                      onChange={handleRegisterChange}
                      className={`auth-input ${registerErrors.primer_apellido ? "input-error" : ""}`}
                      placeholder="Primer Apellido"
                      required
                    />
                  </div>
                  {registerErrors.primer_apellido && (
                    <div className="field-error-msg">⚠️ {registerErrors.primer_apellido}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <div className="input-group-auth">
                    <ion-icon name="people-outline"></ion-icon>
                    <input
                      type="text"
                      name="segundo_apellido"
                      value={registerForm.segundo_apellido}
                      onChange={handleRegisterChange}
                      className={`auth-input ${registerErrors.segundo_apellido ? "input-error" : ""}`}
                      placeholder="Segundo Apellido (Opcional)"
                    />
                  </div>
                  {registerErrors.segundo_apellido && (
                    <div className="field-error-msg">⚠️ {registerErrors.segundo_apellido}</div>
                  )}
                </div>
              </div>

              <div className="row g-2">
                <div className="col-md-6">
                  <div className="input-group-auth">
                    <ion-icon name="card-outline"></ion-icon>
                    <select
                      name="tipo_documento"
                      value={registerForm.tipo_documento}
                      onChange={handleRegisterChange}
                      className={`auth-select with-icon ${registerErrors.tipo_documento ? "input-error" : ""}`}
                      required
                    >
                      <option value="" disabled>Tipo de Doc.</option>
                      <option value="CC">Cédula</option>
                      <option value="TI">Tarjeta de Ident.</option>
                    </select>
                  </div>
                  {registerErrors.tipo_documento && (
                    <div className="field-error-msg">⚠️ {registerErrors.tipo_documento}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <div className="input-group-auth">
                    <ion-icon name="id-card-outline"></ion-icon>
                    <input
                      type="text"
                      name="documento"
                      value={registerForm.documento}
                      onChange={handleRegisterChange}
                      className={`auth-input ${registerErrors.documento ? "input-error" : ""}`}
                      placeholder="N° Documento"
                      required
                    />
                  </div>
                  {registerErrors.documento && (
                    <div className="field-error-msg">⚠️ {registerErrors.documento}</div>
                  )}
                </div>
              </div>

              <div className="row g-2">
                <div className="col-md-6">
                  <div className="input-group-auth">
                    <ion-icon name="call-outline"></ion-icon>
                    <input
                      type="text"
                      name="celular"
                      value={registerForm.celular}
                      onChange={handleRegisterChange}
                      className={`auth-input ${registerErrors.celular ? "input-error" : ""}`}
                      placeholder="Número de Celular"
                      required
                    />
                  </div>
                  {registerErrors.celular && (
                    <div className="field-error-msg">⚠️ {registerErrors.celular}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <div className="input-group-auth">
                    <ion-icon name="mail-outline"></ion-icon>
                    <input
                      type="email"
                      name="correo_electronico"
                      value={registerForm.correo_electronico}
                      onChange={handleRegisterChange}
                      className={`auth-input ${registerErrors.correo_electronico ? "input-error" : ""}`}
                      placeholder="Correo Electrónico"
                      required
                    />
                  </div>
                  {registerErrors.correo_electronico && (
                    <div className="field-error-msg">⚠️ {registerErrors.correo_electronico}</div>
                  )}
                </div>
              </div>

              <div className="row g-2">
                <div className="col-md-6">
                  <div className="input-group-auth">
                    <ion-icon name="lock-closed-outline"></ion-icon>
                    <input
                      type={verPass ? "text" : "password"}
                      name="contrasena"
                      value={registerForm.contrasena}
                      onChange={handleRegisterChange}
                      className={`auth-input ${registerErrors.contrasena ? "input-error" : ""}`}
                      placeholder="Contraseña (mín 8 car.)"
                      required
                    />
                    <span className="password-toggle" onClick={() => setVerPass(!verPass)}>
                      <ion-icon name={verPass ? "eye-off-outline" : "eye-outline"}></ion-icon>
                    </span>
                  </div>
                  {registerErrors.contrasena && (
                    <div className="field-error-msg">⚠️ {registerErrors.contrasena}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <div className="input-group-auth">
                    <ion-icon name="school-outline"></ion-icon>
                    <input
                      type="text"
                      name="grupo_formacion"
                      value={registerForm.grupo_formacion}
                      onChange={handleRegisterChange}
                      className={`auth-input ${registerErrors.grupo_formacion ? "input-error" : ""}`}
                      placeholder="N° Ficha (Grupo)"
                      required
                    />
                  </div>
                  {registerErrors.grupo_formacion && (
                    <div className="field-error-msg">⚠️ {registerErrors.grupo_formacion}</div>
                  )}
                </div>
              </div>
            </div>

            <button type="submit" className="auth-btn mt-3">Registrarse</button>
            <div className="mobile-toggle-wrapper">
              <p>¿Ya tienes cuenta? <span className="mobile-toggle-btn" onClick={() => setIsSignUp(false)}>Inicia sesión aquí</span></p>
            </div>
          </form>
        </div>

        {/* ── FORMULARIO DE LOGIN ── */}
        <div className="form-container sign-in-container">
          <form className="auth-form" onSubmit={handleLoginSubmit} noValidate>
            <img src={logoSena} alt="logo-sena" className="logosena-auth" />
            <h1>SENA GDF</h1>
            <p>Inicia sesión con tu documento y contraseña</p>

            <div className="input-group-auth">
              <ion-icon name="card-outline"></ion-icon>
              <select
                name="tipo_documento"
                value={loginForm.tipo_documento}
                onChange={handleLoginChange}
                className={`auth-select with-icon ${loginErrors.tipo_documento ? "input-error" : ""}`}
                required
              >
                <option value="" disabled hidden>Selecciona tu documento</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="TI">Tarjeta de Identidad</option>
              </select>
            </div>
            {loginErrors.tipo_documento && (
              <div className="field-error-msg">⚠️ {loginErrors.tipo_documento}</div>
            )}

            <div className="input-group-auth">
              <ion-icon name="person-circle-outline"></ion-icon>
              <input
                type="text"
                name="documento"
                value={loginForm.documento}
                onChange={handleLoginChange}
                className={`auth-input ${loginErrors.documento ? "input-error" : ""}`}
                placeholder="Número de documento"
                required
              />
            </div>
            {loginErrors.documento && (
              <div className="field-error-msg">⚠️ {loginErrors.documento}</div>
            )}

            <div className="input-group-auth">
              <ion-icon name="lock-closed-outline"></ion-icon>
              <input
                type="password"
                name="contrasena"
                value={loginForm.contrasena}
                onChange={handleLoginChange}
                className={`auth-input ${loginErrors.contrasena ? "input-error" : ""}`}
                placeholder="Contraseña"
                required
              />
            </div>
            {loginErrors.contrasena && (
              <div className="field-error-msg">⚠️ {loginErrors.contrasena}</div>
            )}

            <Link to="/Repecuperar_contraseña">¿Olvidaste tu contraseña?</Link>

            <button type="submit" className="auth-btn">Ingresar</button>
            <div className="mobile-toggle-wrapper">
              <p>¿No tienes cuenta? <span className="mobile-toggle-btn" onClick={() => setIsSignUp(true)}>Regístrate aquí</span></p>
            </div>
          </form>
        </div>

        {/* ── PANEL OVERLAY ── */}
        <div className="overlay-container">
          <div className="overlay-panel overlay-left">
            <h1>¡Bienvenido de nuevo!</h1>
            <p>Inicia sesión con tu información personal.</p>
            <button className="auth-btn ghost" onClick={() => setIsSignUp(false)}>Iniciar Sesión</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>¡Hola, Aprendiz!</h1>
            <p>Ingresa tus datos y comienza tu viaje en SENA GDF.</p>
            <button className="auth-btn ghost" onClick={() => setIsSignUp(true)}>Crear Cuenta</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;
