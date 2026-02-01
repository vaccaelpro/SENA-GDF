import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../css/recuperarpass2.css";
import logoSena from "../../assets/img/logosena2.png";

const RestablecerPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);
    const [esExitoso, setEsExitoso] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setMensaje("");

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

            setEsExitoso(true);
            setMensaje("¡Contraseña actualizada correctamente!");
            setTimeout(() => navigate("/"), 2500);

        } catch (error) {
            setEsExitoso(false);
            setMensaje(error.message || "Token inválido o expirado");
        } finally {
            setCargando(false);
        }
    };

    return (
        <>
           <div className="vh-100 d-flex justify-content-center align-items-center">
                <div className="rp-container">
                    <div className="rp-left">
                        <img src={logoSena} alt="SENA" className="rp-logo" />
                        <h5 className="rp-title">SENA GDF</h5>
                        <p className="rp-text">
                            Crea una nueva contraseña segura para tu cuenta
                        </p>
                    </div>

                    <div className="rp-right">
                        <div className="rp-form-title">RESTABLECER</div>
                        <p className="rp-form-subtitle">
                            Ingresa tu nueva contraseña para continuar
                        </p>

                        <form className="w-100" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="form-control rp-input"
                                    placeholder="Nueva contraseña (min. 8 caracteres)"
                                    minLength={8}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button className="rp-btn" disabled={cargando}>
                                {cargando ? "PROCESANDO..." : "CAMBIAR CONTRASEÑA"}
                            </button>
                        </form>

                        {mensaje && (
                            <p className={`rp-message ${esExitoso ? "success" : "error"}`}>
                                {mensaje}
                            </p>
                        )}
                    </div>
                </div>
            </div>

        </>
    );
};

export default RestablecerPassword;
