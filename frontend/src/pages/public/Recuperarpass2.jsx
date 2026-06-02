import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../css/recuperarpass2.css";
import logoSena from "../../assets/img/logosena.png";

const RestablecerPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [verPass, setVerPass] = useState(false);
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);

        try {
            const res = await fetch("http://localhost:3001/api/auth/restablecer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    nuevaContrasena: password,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            Swal.fire({
                icon: "success",
                title: "¡Contraseña Actualizada!",
                text: "Tu contraseña ha sido restablecida correctamente. Ahora serás redirigido al inicio de sesión.",
                confirmButtonColor: "#28a745"
            });
            setTimeout(() => navigate("/"), 2500);

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Token inválido o expirado",
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

                    <form className="w-100 px-3" onSubmit={handleSubmit}>
                        <div className="input-group-auth">
                            <ion-icon name="lock-closed-outline"></ion-icon>
                            <input
                                type={verPass ? "text" : "password"}
                                className="auth-input"
                                placeholder="Nueva contraseña (mín. 8 caracteres)"
                                minLength={8}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className="password-toggle" onClick={() => setVerPass(!verPass)}>
                                <ion-icon name={verPass ? "eye-off-outline" : "eye-outline"}></ion-icon>
                            </span>
                        </div>

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

