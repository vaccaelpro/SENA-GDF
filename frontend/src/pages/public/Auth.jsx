import React, { useState, useEffect } from "react";
import { login, registrar } from "../../services/auth/auth.service";
import Swal from "sweetalert2";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../css/auth.css";
import logoSena from "../../assets/img/logosena.png"; 

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    if (location.pathname === "/Registro") {
      setIsSignUp(true);
    } else {
      setIsSignUp(false);
    }
  }, [location.pathname]);

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

  // ========== LOGIN ==========
  const [loginForm, setLoginForm] = useState({
    tipo_documento: "",
    documento: "",
    contrasena: "",
  });

  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!loginForm.tipo_documento || !loginForm.documento || !loginForm.contrasena) {
      Toast.fire({
        icon: "warning",
        title: "Por favor, completa todos los campos."
      });
      return;
    }

    try {
      const data = await login(loginForm);

      if (data.success) {
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        localStorage.setItem("rol", data.rol);

        Toast.fire({
          icon: "success",
          title: "¡Inicio de sesión exitoso!"
        });

        setTimeout(() => {
          if (data.rol === "USUARIO") navigate("/Novedades_aprendiz");
          else if (data.rol === "ADMIN") navigate("/Agregar_novedad");
          else {
            Swal.fire("Error", "Rol no autorizado", "error");
          }
        }, 1500);

      } else {
        Swal.fire({
          icon: "error",
          title: "Error al iniciar sesión",
          text: data.message,
          confirmButtonColor: "#28a745"
        });
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Error del servidor. Por favor, intenta nuevamente.";
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMsg,
        confirmButtonColor: "#28a745"
      });
    }
  };

  // ========== REGISTER ==========
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

  const handleRegisterChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (registerForm.contrasena.length < 8) {
      Toast.fire({
        icon: "warning",
        title: "La contraseña debe tener al menos 8 caracteres."
      });
      return;
    }

    try {
      await registrar(registerForm);
      
      Swal.fire({
        icon: "success",
        title: "¡Registro Exitoso!",
        text: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.",
        confirmButtonColor: "#28a745"
      }).then(() => {
        setIsSignUp(false);
        setRegisterForm({
          primer_nombre: "", segundo_nombre: "", primer_apellido: "", segundo_apellido: "",
          tipo_documento: "", documento: "", celular: "", correo_electronico: "", contrasena: "", grupo_formacion: "",
        });
      });

    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error al registrar usuario";
      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text: errorMsg,
        confirmButtonColor: "#28a745"
      });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className={`auth-container ${isSignUp ? "right-panel-active" : ""}`}>
        
        {/* SIGN UP FORM */}
        <div className="form-container sign-up-container">
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <h1>Crea Tu Cuenta</h1>
            <p>Ingresa tus datos para registrarte en SENA GDF</p>
            
            <div className="scroll-form">
              <div className="row g-2">
                <div className="col-md-6">
                  <div className="input-group-auth">
                    <ion-icon name="person-outline"></ion-icon>
                    <input type="text" name="primer_nombre" value={registerForm.primer_nombre} onChange={handleRegisterChange} className="auth-input" placeholder="Primer Nombre" required />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input-group-auth">
                    <ion-icon name="person-outline"></ion-icon>
                    <input type="text" name="segundo_nombre" value={registerForm.segundo_nombre} onChange={handleRegisterChange} className="auth-input" placeholder="Segundo Nombre" />
                  </div>
                </div>
              </div>
              <div className="row g-2">
                <div className="col-md-6">
                  <div className="input-group-auth">
                    <ion-icon name="people-outline"></ion-icon>
                    <input type="text" name="primer_apellido" value={registerForm.primer_apellido} onChange={handleRegisterChange} className="auth-input" placeholder="Primer Apellido" required />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input-group-auth">
                    <ion-icon name="people-outline"></ion-icon>
                    <input type="text" name="segundo_apellido" value={registerForm.segundo_apellido} onChange={handleRegisterChange} className="auth-input" placeholder="Segundo Apellido" />
                  </div>
                </div>
              </div>
              
              <div className="row g-2">
                <div className="col-md-6">
                  <div className="input-group-auth">
                    <ion-icon name="card-outline"></ion-icon>
                    <select name="tipo_documento" value={registerForm.tipo_documento} onChange={handleRegisterChange} className="auth-select with-icon" required>
                      <option value="" disabled>Tipo de Doc.</option>
                      <option value="CC">Cédula</option>
                      <option value="TI">Tarjeta de Ident.</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input-group-auth">
                    <ion-icon name="id-card-outline"></ion-icon>
                    <input type="text" name="documento" value={registerForm.documento} onChange={handleRegisterChange} className="auth-input" placeholder="N° Documento" required />
                  </div>
                </div>
              </div>

              <div className="row g-2">
                <div className="col-md-6">
                  <div className="input-group-auth">
                    <ion-icon name="call-outline"></ion-icon>
                    <input type="text" name="celular" value={registerForm.celular} onChange={handleRegisterChange} className="auth-input" placeholder="Número de Celular" required />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input-group-auth">
                    <ion-icon name="mail-outline"></ion-icon>
                    <input type="email" name="correo_electronico" value={registerForm.correo_electronico} onChange={handleRegisterChange} className="auth-input" placeholder="Correo Electrónico" required />
                  </div>
                </div>
              </div>
              
              <div className="row g-2">
                <div className="col-md-6">
                  <div className="input-group-auth">
                    <ion-icon name="lock-closed-outline"></ion-icon>
                    <input type={verPass ? "text" : "password"} name="contrasena" value={registerForm.contrasena} onChange={handleRegisterChange} className="auth-input" placeholder="Contraseña (mín 8 car.)" minLength={8} required />
                    <span className="password-toggle" onClick={() => setVerPass(!verPass)}>
                      <ion-icon name={verPass ? "eye-off-outline" : "eye-outline"}></ion-icon>
                    </span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input-group-auth">
                    <ion-icon name="school-outline"></ion-icon>
                    <input type="text" name="grupo_formacion" value={registerForm.grupo_formacion} onChange={handleRegisterChange} className="auth-input" placeholder="N° Ficha (Grupo)" required />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="auth-btn mt-3">Registrarse</button>
            <div className="mobile-toggle-wrapper">
              <p>¿Ya tienes cuenta? <span className="mobile-toggle-btn" onClick={() => setIsSignUp(false)}>Inicia sesión aquí</span></p>
            </div>
          </form>
        </div>

        {/* SIGN IN FORM */}
        <div className="form-container sign-in-container">
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <img src={logoSena} alt="logo-sena" className="logosena-auth" />
            <h1>SENA GDF</h1>
            <p>Inicia sesión con tu documento y contraseña</p>
            
            <div className="input-group-auth">
              <ion-icon name="card-outline"></ion-icon>
              <select
                name="tipo_documento"
                value={loginForm.tipo_documento}
                onChange={handleLoginChange}
                className="auth-select with-icon"
                required
              >
                <option value="" disabled hidden>Selecciona tu documento</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="TI">Tarjeta de Identidad</option>
              </select>
            </div>

            <div className="input-group-auth">
              <ion-icon name="person-circle-outline"></ion-icon>
              <input type="text" name="documento" value={loginForm.documento} onChange={handleLoginChange} className="auth-input" placeholder="Número de documento" required />
            </div>

            <div className="input-group-auth">
              <ion-icon name="lock-closed-outline"></ion-icon>
              <input type="password" name="contrasena" value={loginForm.contrasena} onChange={handleLoginChange} className="auth-input" placeholder="Contraseña" required />
            </div>

            <Link to="/Repecuperar_contraseña">¿Olvidaste tu contraseña?</Link>
            
            <button type="submit" className="auth-btn">Ingresar</button>
            <div className="mobile-toggle-wrapper">
              <p>¿No tienes cuenta? <span className="mobile-toggle-btn" onClick={() => setIsSignUp(true)}>Regístrate aquí</span></p>
            </div>
          </form>
        </div>

        {/* OVERLAY PANEL */}
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
