import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { restablecerPassword } from "../../services/auth/auth.service";
import "../../css/recuperarpass2.css";
import logoSena from "../../assets/img/logosena.png";
import { validatePassword } from "../../utils/validators";

const RestablecerPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [errorPass, setErrorPass] = useState("");
    const [verPass, setVerPass] = useState(false);
    const [cargando, setCargando] = useState(false);

    const validate = (val) => {
        const err = validatePassword(val);
        setErrorPass(err);
        return err;
    };

    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setPassword(val);
        validate(val);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate(password);
        if (err) {
            Swal.fire({
                icon: "warning",
                title: "Contraseña No Segura",
                text: err,
                confirmButtonColor: "#28a745"
            });
            return;
        }

        setCargando(true);

        try {
            await restablecerPassword(token, password);

            Swal.fire({
                icon: "success",
                title: "¡Contraseña Actualizada!",
                text: "Tu contraseña ha sido restablecida correctamente. Ahora serás redirigido al inicio de sesión.",
                confirmButtonColor: "#28a745"
            });
            setTimeout(() => navigate("/"), 2500);

        } catch (error) {
            const errorMsg = error.response?.data?.message || "Token inválido o expirado";
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
        <div className="restablecer-wrapper">
            <div className="rp-container">
                
                {/* LEFT COLUMN - OVERLAY STYLE */}
                <div className="rp-left">
                    <img src={logoSena} alt="SENA" className="logosena-auth mb-3" />
                    <h1>SENA GDF</h1>
                    <p>Crea una nueva contraseña segura para recuperar el acceso a tu cuenta.</p>
                </div>

                {/* RIGHT COLUMN - FORM STYLE */}
                <div className="rp-right text-center">
                    <h1>RESTABLECER CONTRASEÑA</h1>
                    <p>Ingresa tu nueva contraseña para continuar.</p>

                    <form className="w-100 px-3" onSubmit={handleSubmit} noValidate>
                        <div className="input-group-auth">
                            <ion-icon name="lock-closed-outline"></ion-icon>
                            <input
                                type={verPass ? "text" : "password"}
                                className={`auth-input ${errorPass ? "input-error" : ""}`}
                                placeholder="Nueva contraseña (mín. 8 caracteres)"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                            <span className="password-toggle" onClick={() => setVerPass(!verPass)}>
                                <ion-icon name={verPass ? "eye-off-outline" : "eye-outline"}></ion-icon>
                            </span>
                        </div>
                        {errorPass && <div className="field-error-msg">⚠️ {errorPass}</div>}

                        <button className="auth-btn mt-3" disabled={cargando}>
                            {cargando ? "Procesando..." : "Cambiar Contraseña"}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default RestablecerPassword;

