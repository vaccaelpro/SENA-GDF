import React, { useState } from "react";
import "../../css/agregar_meta.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Agregar_meta = () => {
  const [meta, setMeta] = useState("");
  const [valorObjetivo, setValorObjetivo] = useState("");
  const [fechaObjetivo, setFechaObjetivo] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      Swal.fire("Error", "No hay sesión activa", "error");
      return;
    }

    if (valorObjetivo <= 0) {
      Swal.fire("Error", "El monto objetivo debe ser mayor a cero", "warning");
      return;
    }
    
    // Validar que la fecha sea futura (no hoy ni pasada)
    const fechaIngresada = new Date(fechaObjetivo + 'T00:00:00'); // Evitar problema de timezone
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    
    if (fechaIngresada <= hoy) {
      Swal.fire("Error", "La fecha límite debe ser futura", "warning");
      return;
    }

    try {
      await axios.post("/api/aprendiz/metas", {
        usuario_id_usuario: usuario.id_usuario,
        meta,
        valor_objetivo: valorObjetivo,
        fecha_objetivo: fechaObjetivo
      });
      Swal.fire("Éxito", "Meta creada correctamente", "success");
      navigate("/Metas_de_ahorro");
    } catch (error) {
      Swal.fire("Error", error.response?.data?.error || "Error al crear la meta", "error");
    }
  };

  return (
    <section className="formulario-meta">
      <h2>Crear meta de ahorro</h2>
      <form className="formulario" onSubmit={handleSubmit}>
        <label>Nombre del ahorro:</label>
        <input type="text" placeholder="Ingresar Nombre" required value={meta} onChange={e => setMeta(e.target.value)} />

        <label>Monto de la meta (Valor Objetivo):</label>
        <input type="number" placeholder="Ingresar monto" required min="1" value={valorObjetivo} onChange={e => setValorObjetivo(e.target.value)} />

        <label>Fecha Límite (Objetivo):</label>
        <input type="date" required value={fechaObjetivo} onChange={e => setFechaObjetivo(e.target.value)} />

        <div className="botones-accion" style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
          <button type="submit" className="btn-crear">Crear</button>
          <Link to="/Metas_de_ahorro">
            <button type="button" className="btn-cancelar" style={{background: '#ccc', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', color: 'black'}}>Cancelar</button>
          </Link>
        </div>
      </form>
    </section>
  );
};

export default Agregar_meta;