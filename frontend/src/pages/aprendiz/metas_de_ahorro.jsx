import React, { useState, useEffect } from "react";
import "../../css/metas_de_ahorro.css";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlusCircle } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const Metas_de_ahorro = () => {
  const [metas, setMetas] = useState([]);

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

  useEffect(() => {
    cargarMetas();
  }, []);

  const eliminarMeta = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`/api/aprendiz/metas/${id}`);
        Swal.fire('Eliminada!', 'Tu meta ha sido eliminada.', 'success');
        cargarMetas();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar la meta', 'error');
      }
    }
  };

  return (
    <section className="contenido">
      <h2>Metas de Ahorro</h2>

      <div className="grid">
        {metas.map((meta) => (
          <div className="card" key={meta.id_ahorro}>
            <h3>{meta.meta}</h3>
            <p>${Number(meta.monto_actual).toLocaleString('es-CO')} Ahorrados de ${Number(meta.valor_objetivo).toLocaleString('es-CO')}</p>
            <p>Fecha Límite: {new Date(meta.fecha_objetivo).toLocaleDateString()}</p>
            <div className="botones">
              <Link to="/Editar_meta" state={{ meta }} className="btn edit">
                <FaEdit /> Editar
              </Link>
              <button className="eliminar" onClick={() => eliminarMeta(meta.id_ahorro)}>
                <FaTrash /> Borrar
              </button>
            </div>
          </div>
        ))}

        <div className="card añadir">
          <Link to="/Agregar_meta" className="añadir-btn">
            <FaPlusCircle /> Agregar meta
          </Link>
          <Link to="/Agregar_monto" className="añadir-btn">
            <FaPlusCircle /> Agregar Monto
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Metas_de_ahorro;