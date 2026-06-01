import { useState, useEffect } from "react";
import { listarAdmin, eliminar } from "../../services/comunicados.service";
import Modificar_novedad_modal from "./Modificar_novedad_modal";
import Swal from "sweetalert2";
import "../../css/eliminar_novedad.css";

const Eliminar_novedad = () => {
  const [comunicados, setComunicados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);

  // Obtener usuario de la sesión actual
  const usuarioStorage = localStorage.getItem("usuario");
  const usuarioActual = usuarioStorage ? JSON.parse(usuarioStorage) : null;

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
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Publicaciones</h3>

      {comunicados.length === 0 ? (
        <div className="alert alert-info">No hay novedades publicadas aún.</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 g-4">
          {comunicados.map((comunicado) => {
            const imgUrl = getImagenUrl(comunicado);
            return (
              <div className="col mb-4" key={comunicado.id_comunicado}>
                <div className="card h-100 text-center">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      className="card-img-top"
                      alt={comunicado.titulo}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="card-img-top bg-secondary d-flex align-items-center justify-content-center"
                      style={{ height: "200px", color: "#fff", fontSize: "3rem" }}
                    >
                      📰
                    </div>
                  )}
                  <div className="card-body">
                    <span className="badge bg-info mb-2">{comunicado.categoria}</span>
                    <h5 className="card-title">{comunicado.titulo}</h5>
                    <p className="card-text text-muted">
                      {comunicado.contenido.substring(0, 200)}
                      {comunicado.contenido.length > 200 ? "..." : ""}
                    </p>
                    <p className="card-text">
                      <small className="text-muted">
                        {new Date(comunicado.fecha_publicacion).toLocaleDateString("es-CO", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        {usuarioActual && ` — Por: ${usuarioActual.primer_nombre} ${usuarioActual.primer_apellido}`}
                      </small>
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        className="btn btn-success"
                        onClick={() => setEditando(comunicado)}
                      >
                        Modificar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleEliminar(comunicado)}
                      >
                        Borrar
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
