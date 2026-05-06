import React, { useState, useEffect } from "react";
import "../../css/editar_meta.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Editar_meta = () => {
  const [meta, setMeta] = useState("");
  const [valorObjetivo, setValorObjetivo] = useState("");
  const [fechaObjetivo, setFechaObjetivo] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const metaToEdit = location.state?.meta;

  useEffect(() => {
    if (metaToEdit) {
        setMeta(metaToEdit.meta);
        setValorObjetivo(metaToEdit.valor_objetivo);
        setFechaObjetivo(metaToEdit.fecha_objetivo.split('T')[0]); // Formatear YYYY-MM-DD
    } else {
        navigate("/Metas_de_ahorro");
    }
  }, [metaToEdit, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (valorObjetivo <= 0) {
      Swal.fire("Error", "El monto objetivo debe ser mayor a cero", "warning");
      return;
    }
    
    // Validar fecha futura
    const fechaIngresada = new Date(fechaObjetivo + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    
    if (fechaIngresada <= hoy) {
      Swal.fire("Error", "La fecha límite debe ser futura", "warning");
      return;
    }

    try {
      await axios.put(`/api/aprendiz/metas/${metaToEdit.id_ahorro}`, {
        meta,
        valor_objetivo: valorObjetivo,
        fecha_objetivo: fechaObjetivo
      });
      Swal.fire("Éxito", "Meta actualizada correctamente", "success");
      navigate("/Metas_de_ahorro");
    } catch (error) {
      Swal.fire("Error", error.response?.data?.error || "Error al actualizar", "error");
    }
  };

  return (
    <section className="formulario-editar">
      <h2>Editar meta de ahorro</h2>
      <form className="formulario" onSubmit={handleSubmit}>
        <label>Nombre del ahorro:</label>
        <input type="text" placeholder="Ingresar Nombre" required value={meta} onChange={e => setMeta(e.target.value)} />

        <label>Monto de la meta (Valor Objetivo):</label>
        <input type="number" placeholder="Ingresar monto" required min="1" value={valorObjetivo} onChange={e => setValorObjetivo(e.target.value)} />

        <label>Fecha Límite (Objetivo):</label>
        <input type="date" required value={fechaObjetivo} onChange={e => setFechaObjetivo(e.target.value)} />

        <div className="botones-accion" style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
          <button type="submit" className="btn-actualizar">Actualizar</button>
          <Link to="/Metas_de_ahorro">
            <button type="button" className="btn-cancelar" style={{background: '#ccc', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', color: 'black'}}>Cancelar</button>
          </Link>
        </div>
      </form>
    </section>
  );
};

export default Editar_meta;