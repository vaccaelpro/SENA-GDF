import React, { useState, useEffect } from "react";
import "../../css/agregar_monto.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Agregar_monto = () => {
  const [monto, setMonto] = useState("");
  const [metaId, setMetaId] = useState("");
  const [metas, setMetas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarMetas = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (!usuario) return;
        const res = await axios.get(`/api/aprendiz/metas?usuario_id=${usuario.id_usuario}`);
        setMetas(res.data);
      } catch (error) {
        console.error("Error al cargar metas", error);
      }
    };
    cargarMetas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      Swal.fire("Error", "No hay sesión activa", "error");
      return;
    }

    if (monto <= 0) {
      Swal.fire("Error", "El monto debe ser mayor a cero", "warning");
      return;
    }

    try {
      await axios.post("/api/aprendiz/ingresos", {
        usuario_id_usuario: usuario.id_usuario,
        monto,
        meta_id: metaId || null
      });
      Swal.fire("Éxito", "Monto registrado correctamente", "success");
      navigate("/Metas_de_ahorro");
    } catch (error) {
      Swal.fire("Error", error.response?.data?.error || "Error al registrar el monto", "error");
    }
  };

  return (
    <div className="main-content">
      <section className="formulario-monto">
        <h2>Añadir Monto</h2>

        <form className="formulario" onSubmit={handleSubmit}>
          <label style={{ fontSize: "15px" }}>Ingresar monto de apoyo socioeconómico / ingreso:</label>
          <input
            type="number"
            placeholder="Ingresar monto"
            style={{ fontSize: "17px" }}
            required
            min="1"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />

          <label>¿Vincular a una meta de ahorro? (Opcional):</label>
          <select style={{ fontSize: "17px" }} value={metaId} onChange={(e) => setMetaId(e.target.value)}>
            <option value="">No vincular</option>
            {metas.map((m) => (
              <option key={m.id_ahorro} value={m.id_ahorro}>{m.meta}</option>
            ))}
          </select>

          <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
            <button type="submit" className="btn-añadir">Añadir</button>
            <Link to="/Metas_de_ahorro">
              <button type="button" className="btn-cancelar" style={{background: '#ccc', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', color: 'black'}}>Cancelar</button>
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Agregar_monto;