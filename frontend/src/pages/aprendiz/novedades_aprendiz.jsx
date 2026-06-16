import { useState, useEffect } from "react";
import { listarPublicos } from "../../services/admin/comunicados.service";
import "../../css/novedades_aprendiz.css";

const Novedades_aprendiz = () => {
  const [comunicados, setComunicados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await listarPublicos();
        setComunicados(data);
      } catch (err) {
        console.error("Error al cargar novedades:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
        <div className="alert alert-info">No hay novedades disponibles.</div>
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
                    <p className="card-text">
                      {comunicado.contenido.substring(0, 300)}
                      {comunicado.contenido.length > 300 ? "..." : ""}
                    </p>
                    <p className="card-text">
                      <small className="text-muted">
                        {new Date(comunicado.fecha_publicacion).toLocaleDateString("es-CO", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </small>
                    </p>
                    {comunicado.url_referencia && (
                      <a
                        href={comunicado.url_referencia}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm"
                      >
                        Más información
                      </a>
                    )}
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

export default Novedades_aprendiz;
