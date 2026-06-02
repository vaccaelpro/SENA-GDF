import { useState, useEffect } from "react";
import { listarAdmin, eliminar } from "../../services/comunicados.service";
import Modificar_novedad_modal from "./Modificar_novedad_modal";
import Swal from "sweetalert2";
import { FaNewspaper, FaEdit, FaTrashAlt, FaCalendarAlt, FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../css/eliminar_novedad.css";

const Eliminar_novedad = () => {
  const [comunicados, setComunicados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);

  const cargar = async () => {
    try {
      setLoading(true);
      const data = await listarAdmin();
      setComunicados(data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudieron cargar las novedades", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleEliminar = async (comunicado) => {
    const result = await Swal.fire({
      title: "¿Eliminar novedad?",
      html: `
        <p><strong>${comunicado.titulo}</strong></p>
        <p style="font-size:0.9rem;color:#666;">${comunicado.contenido.substring(0, 150)}${comunicado.contenido.length > 150 ? "..." : ""}</p>
        <p style="font-size:1.1rem;color:#666;"> <strong>¡ESTA ACCIÓN NO PUEDE REVERTIRSE!</strong> </p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await eliminar(comunicado.id_comunicado);
      Swal.fire("Eliminado", "La novedad se eliminó correctamente", "success");
      cargar();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo eliminar la novedad", "error");
    }
  };

  const getImagenUrl = (comunicado) => {
    if (comunicado.imagen_url) {
      return `http://localhost:3001/uploads/${comunicado.imagen_url}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="spinner-border text-success" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2 text-muted">Cargando publicaciones...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="d-flex align-items-center gap-2">
          <FaNewspaper className="text-success" />
          Publicaciones
        </h3>

        <Link to="/Agregar_novedad" className="btn btn-success d-flex align-items-center gap-2">
          <FaPlusCircle />
          Nueva Publicación
        </Link>
      </div>

      {comunicados.length === 0 ? (
        <div className="text-center py-5">
          <FaNewspaper size={60} className="text-muted mb-3" />
          <h5 className="text-muted">No hay novedades publicadas aún</h5>
          <Link to="/Agregar_novedad" className="btn btn-success mt-3">
            Crear la primera publicación
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {comunicados.map((comunicado) => {
            const imgUrl = getImagenUrl(comunicado);
            return (
              <div className="col-md-6 col-lg-6" key={comunicado.id_comunicado}>
                <div className="card shadow-sm border-0 h-100">
                  <div
                    className="card-header text-white d-flex align-items-center justify-content-between"
                    style={{ background: "linear-gradient(135deg, #28a745, #218838)" }}
                  >
                    <h5 className="mb-0 text-truncate">{comunicado.titulo}</h5>
                    <span className="badge bg-light text-success ms-2 flex-shrink-0">
                      {comunicado.categoria}
                    </span>
                  </div>

                  {imgUrl && (
                    <img
                      src={imgUrl}
                      className="card-img-top"
                      alt={comunicado.titulo}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}

                  <div className="card-body d-flex flex-column">
                    <p className="card-text text-muted flex-grow-1">
                      {comunicado.contenido.substring(0, 250)}
                      {comunicado.contenido.length > 250 ? "..." : ""}
                    </p>

                    <div className="d-flex align-items-center text-muted mb-3">
                      <FaCalendarAlt className="me-2 text-success" size={13} />
                      <small>
                        {new Date(comunicado.fecha_publicacion).toLocaleDateString("es-CO", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </small>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-success btn-sm d-flex align-items-center gap-1 flex-fill"
                        onClick={() => setEditando(comunicado)}
                      >
                        <FaEdit /> Modificar
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 flex-fill"
                        onClick={() => handleEliminar(comunicado)}
                      >
                        <FaTrashAlt /> Borrar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editando && (
        <Modificar_novedad_modal
          comunicado={editando}
          onClose={() => setEditando(null)}
          onActualizado={cargar}
        />
      )}
    </div>
  );
};

export default Eliminar_novedad;
