import React, { useState, useEffect } from "react";
import "../../css/lista_grupos.css"
import {
  FaUsers,
  FaPlusCircle,
  FaCalendarAlt,
  FaComments,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { listarGrupos, eliminarGrupo, actualizarGrupo } from "../../services/admin/grupos.service";

const Lista_grupos = () => {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for inline editing
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: "", descripcion: "" });
  const [expandedGroup, setExpandedGroup] = useState(null);

  const fetchGrupos = async () => {
    try {
      const data = await listarGrupos();
      setGrupos(data);
    } catch (error) {
      console.error("Error fetching grupos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrupos();
  }, []);

  const handleDeleteGrupo = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este grupo? Se perderán todos sus mensajes y asociaciones.")) {
      return;
    }
    try {
      await eliminarGrupo(id);
      fetchGrupos();
    } catch (error) {
      console.error("Error eliminando el grupo:", error);
      alert("Error al eliminar el grupo.");
    }
  };

  const startEditing = (grupo) => {
    setEditingGroupId(grupo.id_grupo);
    setEditForm({ nombre: grupo.nombre, descripcion: grupo.descripcion });
  };

  const cancelEditing = () => {
    setEditingGroupId(null);
    setEditForm({ nombre: "", descripcion: "" });
  };

  const handleSaveGrupo = async (id) => {
    try {
      await actualizarGrupo(id, editForm);
      setEditingGroupId(null);
      fetchGrupos();
    } catch (error) {
      console.error("Error actualizando el grupo:", error);
      alert("Error al actualizar el grupo.");
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="d-flex align-items-center gap-2">
          <FaUsers className="text-success" />
          Lista de Grupos
        </h3>

        <Link to="/Crear_grupo" className="btn btn-success d-flex align-items-center gap-2">
          <FaPlusCircle />
          Crear Nuevo Grupo
        </Link>
      </div>

      {loading ? (
        <div className="text-center">Cargando grupos...</div>
      ) : grupos.length === 0 ? (
        <div className="alert alert-info">No hay grupos creados aún.</div>
      ) : (
        <div className="row g-4">
          {grupos.map((grupo) => {
            const isEditing = editingGroupId === grupo.id_grupo;

            return (
              <div className="col-md-6 col-lg-4" key={grupo.id_grupo}>
                <div className="card shadow-sm border-0 h-100">
                  <div
                    className="card-header text-white"
                    style={{
                      background: "linear-gradient(135deg, #28a745, #218838)",
                    }}
                  >
                    {isEditing ? (
                      <input 
                        type="text" 
                        className="form-control form-control-sm" 
                        value={editForm.nombre}
                        onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
                      />
                    ) : (
                      <h5 className="mb-0 d-flex align-items-center gap-2">
                        <FaUsers />
                        {grupo.nombre}
                      </h5>
                    )}
                  </div>

                  <div className="card-body d-flex flex-column">
                    <p className="text-muted mb-2 d-flex align-items-center gap-2">
                      <FaCalendarAlt />
                      Creado: {new Date(grupo.fecha_creacion).toLocaleDateString()}
                    </p>

                    {isEditing ? (
                      <textarea 
                        className="form-control mb-3 flex-grow-1" 
                        rows="3"
                        value={editForm.descripcion}
                        onChange={(e) => setEditForm({...editForm, descripcion: e.target.value})}
                      />
                    ) : (
                      <>
                        <p className="card-text flex-grow-1 mb-1">
                          {grupo.descripcion}
                        </p>
                        {expandedGroup === grupo.id_grupo && (
                          <div className="mt-2 p-2 bg-light rounded" style={{maxHeight: '100px', overflowY: 'auto', fontSize: '0.85rem'}}>
                            <strong>Miembros: </strong> 
                            {grupo.nombres_miembros || "No hay miembros asignados"}
                          </div>
                        )}
                      </>
                    )}

                    <div className="d-flex justify-content-between align-items-center mt-auto pt-3">
                      <span 
                        className="badge bg-success d-flex align-items-center gap-1" 
                        style={{cursor: 'pointer'}}
                        onClick={() => setExpandedGroup(expandedGroup === grupo.id_grupo ? null : grupo.id_grupo)}
                        title="Clic para ver nombres"
                      >
                        <FaUsers /> {grupo.cantidad_miembros || 0} miembros
                      </span>

                      <div className="btn-group">
                        {isEditing ? (
                          <>
                            <button className="btn btn-sm btn-outline-success" onClick={() => handleSaveGrupo(grupo.id_grupo)} title="Guardar">
                              <FaCheck />
                            </button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={cancelEditing} title="Cancelar">
                              <FaTimes />
                            </button>
                          </>
                        ) : (
                          <>
                            <Link to={`/Chat_admin/${grupo.id_grupo}`} className="btn btn-sm btn-outline-success" title="Ir al chat">
                              <FaComments />
                            </Link>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => startEditing(grupo)} title="Editar">
                              <FaEdit />
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteGrupo(grupo.id_grupo)} title="Eliminar">
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Lista_grupos;