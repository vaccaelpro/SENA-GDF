import { useState, useEffect } from "react";
import { actualizar } from "../../services/admin/comunicados.service";
import Swal from "sweetalert2";
import { FaEdit, FaNewspaper, FaTag, FaImage, FaLink, FaSave, FaTimes } from "react-icons/fa";
import { validateUrl } from "../../utils/validators";

const Modificar_novedad_modal = ({ comunicado, onClose, onActualizado }) => {
  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    categoria: "",
    url_referencia: "",
  });
  const [formErrors, setFormErrors] = useState({});
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
        setImagenPreview(comunicado.imagen_url);
      }
      setFormErrors({});
    }
  }, [comunicado]);

  if (!comunicado) return null;

  const validateField = (name, value) => {
    let err = "";
    if (name === "titulo" && !value.trim()) err = "El título es obligatorio.";
    if (name === "contenido" && !value.trim()) err = "El contenido es obligatorio.";
    if (name === "url_referencia") err = validateUrl(value);

    setFormErrors((prev) => ({ ...prev, [name]: err }));
    return err;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
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

    const errTit = validateField("titulo", form.titulo);
    const errCont = validateField("contenido", form.contenido);
    const errUrl = validateField("url_referencia", form.url_referencia);

    if (errTit || errCont || errUrl) {
      Swal.fire("Validación", "Por favor completa los campos requeridos y verifica que la URL sea válida", "warning");
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
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <FaEdit /> Modificar Publicación
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group-premium">
                <label className="form-label-premium d-flex align-items-center gap-2">
                  <FaNewspaper /> Título
                </label>
                <input
                  type="text"
                  className={`form-control form-control-premium ${formErrors.titulo ? 'border-danger' : ''}`}
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  placeholder="Título de la publicación"
                  required
                />
                {formErrors.titulo && <small className="text-danger fw-bold d-block mt-1">⚠️ {formErrors.titulo}</small>}
              </div>

              <div className="form-group-premium">
                <label className="form-label-premium d-flex align-items-center gap-2">
                  <FaNewspaper /> Contenido
                </label>
                <textarea
                  className={`form-control form-control-premium ${formErrors.contenido ? 'border-danger' : ''}`}
                  name="contenido"
                  rows="5"
                  value={form.contenido}
                  onChange={handleChange}
                  placeholder="Contenido de la publicación"
                  required
                ></textarea>
                {formErrors.contenido && <small className="text-danger fw-bold d-block mt-1">⚠️ {formErrors.contenido}</small>}
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group-premium">
                    <label className="form-label-premium d-flex align-items-center gap-2">
                      <FaTag /> Categoría
                    </label>
                    <select
                      className="form-control form-control-premium"
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
                </div>

                <div className="col-md-6">
                  <div className="form-group-premium">
                    <label className="form-label-premium d-flex align-items-center gap-2">
                      <FaLink /> URL de referencia
                    </label>
                    <input
                      className={`form-control form-control-premium ${formErrors.url_referencia ? 'border-danger' : ''}`}
                      type="text"
                      name="url_referencia"
                      value={form.url_referencia}
                      onChange={handleChange}
                      placeholder="https://ejemplo.com"
                    />
                    {formErrors.url_referencia && <small className="text-danger fw-bold d-block mt-1">⚠️ {formErrors.url_referencia}</small>}
                  </div>
                </div>
              </div>

              <div className="form-group-premium">
                <label className="form-label-premium d-flex align-items-center gap-2">
                  <FaImage /> Imagen
                </label>
                <input
                  className="form-control form-control-premium"
                  type="file"
                  accept="image/*"
                  onChange={handleImagen}
                />
                <small className="text-muted d-block mt-1">Formatos: PNG, JPG, GIF, WebP — Máx 5MB</small>
                {imagenPreview && (
                  <div className="mt-2 position-relative d-inline-block">
                    <img
                      src={imagenPreview}
                      alt="Vista previa"
                      style={{ maxWidth: "200px", maxHeight: "150px", borderRadius: "8px", border: "2px solid #28a745" }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                      onClick={() => { setImagen(null); setImagenPreview(null); }}
                      style={{ borderRadius: "50%", width: "24px", height: "24px", padding: 0, lineHeight: "16px" }}
                      title="Quitar imagen"
                    >
                      &times;
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer d-flex justify-content-between">
              <button type="button" className="btn btn-secondary d-flex align-items-center gap-2" onClick={onClose}>
                <FaTimes /> Cancelar
              </button>
              <button type="submit" className="btn-save-premium d-flex align-items-center gap-2" disabled={loading}>
                <FaSave />
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
