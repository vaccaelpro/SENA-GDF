import { useState, useEffect } from "react";
import { actualizar } from "../../services/comunicados.service";
import Swal from "sweetalert2";

const Modificar_novedad_modal = ({ comunicado, onClose, onActualizado }) => {
  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    categoria: "",
    url_referencia: "",
  });
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (comunicado) {
      setForm({
        titulo: comunicado.titulo || "",
        contenido: comunicado.contenido || "",
        categoria: comunicado.categoria || "",
        url_referencia: comunicado.url_referencia || "",
      });
      if (comunicado.imagen_url) {
        setImagenPreview(`http://localhost:3001/uploads/${comunicado.imagen_url}`);
      }
    }
  }, [comunicado]);

  if (!comunicado) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("Error", "La imagen no puede superar los 5MB", "error");
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      Swal.fire("Error", "Solo se permiten imágenes", "error");
      e.target.value = "";
      return;
    }

    setImagen(file);
    const reader = new FileReader();
    reader.onload = () => setImagenPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const convertirABase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.titulo.trim() || !form.contenido.trim()) {
      Swal.fire("Validación", "Título y contenido son obligatorios", "warning");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        titulo: form.titulo.trim(),
        contenido: form.contenido.trim(),
        categoria: form.categoria || "Noticias",
        url_referencia: form.url_referencia.trim() || null,
      };

      if (imagen) {
        payload.imagen_base64 = await convertirABase64(imagen);
      } else if (comunicado.imagen_url && !imagen) {
        payload.mantener_imagen = true;
      }

      await actualizar(comunicado.id_comunicado, payload);
      Swal.fire("¡Actualizado!", "La novedad se actualizó correctamente", "success");
      onActualizado();
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo actualizar la novedad", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modificar Publicación</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  className="form-control"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Contenido</label>
                <textarea
                  className="form-control"
                  name="contenido"
                  rows="4"
                  value={form.contenido}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Categoría</label>
                <select
                  className="form-select"
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                >
                  <option value="">Seleccione una categoría</option>
                  <option value="Noticias">Noticias</option>
                  <option value="Eventos">Eventos</option>
                  <option value="Anuncios">Anuncios</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Imagen</label>
                <input
                  className="form-control"
                  type="file"
                  accept="image/*"
                  onChange={handleImagen}
                />
                {imagenPreview && (
                  <div className="mt-2">
                    <img
                      src={imagenPreview}
                      alt="Vista previa"
                      style={{ maxWidth: "200px", maxHeight: "150px", borderRadius: "8px" }}
                    />
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">URL de referencia</label>
                <input
                  className="form-control"
                  type="url"
                  name="url_referencia"
                  value={form.url_referencia}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modificar_novedad_modal;
