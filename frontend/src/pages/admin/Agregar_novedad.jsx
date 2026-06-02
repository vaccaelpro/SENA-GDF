import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { crear, actualizar, obtenerPorId } from "../../services/comunicados.service";
import Swal from "sweetalert2";
import { FaNewspaper, FaTag, FaImage, FaLink, FaSave, FaArrowLeft, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../css/agregar_novedad.css";

const Agregar_novedad = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    categoria: "",
    url_referencia: "",
  });
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useState(() => {
    if (id) {
      (async () => {
        try {
          const data = await obtenerPorId(id);
          setForm({
            titulo: data.titulo || "",
            contenido: data.contenido || "",
            categoria: data.categoria || "",
            url_referencia: data.url_referencia || "",
          });
          if (data.imagen_url) {
            setImagenPreview(`http://localhost:3001/uploads/${data.imagen_url}`);
          }
        } catch (err) {
          Swal.fire("Error", "No se pudo cargar la novedad", "error");
          navigate("/Eliminar_novedad");
        }
      })();
    }
  }, [id]);

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
      }

      const usuarioStorage = localStorage.getItem("usuario");
      if (usuarioStorage) {
        const usuario = JSON.parse(usuarioStorage);
        payload.usuario_id = usuario.id_usuario;
      }

      if (isEditing && imagenPreview && !imagenPreview.startsWith("data:")) {
        payload.mantener_imagen = true;
      }

      if (isEditing) {
        await actualizar(id, payload);
        Swal.fire("¡Actualizado!", "La novedad se actualizó correctamente", "success");
      } else {
        await crear(payload);
        Swal.fire("¡Publicado!", "La novedad se creó correctamente", "success");
      }

      navigate("/Eliminar_novedad");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo guardar la novedad", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="card shadow-sm border-0">
        <div
          className="card-header text-white d-flex align-items-center gap-2"
          style={{ background: "linear-gradient(135deg, #28a745, #218838)" }}
        >
          {isEditing ? <FaEdit size={20} /> : <FaNewspaper size={20} />}
          <h4 className="mb-0">{isEditing ? "Editar Publicación" : "Nueva Publicación"}</h4>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold d-flex align-items-center gap-2">
                <FaNewspaper className="text-success" /> Título
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                id="titulo"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                placeholder="Ingrese el título de la publicación"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold d-flex align-items-center gap-2">
                <FaNewspaper className="text-success" /> Contenido
              </label>
              <textarea
                className="form-control"
                id="contenido"
                name="contenido"
                rows="6"
                value={form.contenido}
                onChange={handleChange}
                placeholder="Escriba el contenido de la publicación"
                required
              ></textarea>
            </div>

            <div className="row mb-4">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label fw-bold d-flex align-items-center gap-2">
                  <FaTag className="text-success" /> Categoría
                </label>
                <select
                  className="form-select"
                  id="categoria"
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

              <div className="col-md-6">
                <label className="form-label fw-bold d-flex align-items-center gap-2">
                  <FaLink className="text-success" /> URL de referencia
                </label>
                <input
                  className="form-control"
                  type="url"
                  id="url_referencia"
                  name="url_referencia"
                  value={form.url_referencia}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold d-flex align-items-center gap-2">
                <FaImage className="text-success" /> Imagen
              </label>
              <input
                className="form-control"
                type="file"
                id="imagen"
                accept="image/*"
                onChange={handleImagen}
              />
              <small className="text-muted d-block mt-1">Formatos: PNG, JPG, GIF, WebP — Máx 5MB</small>
              {imagenPreview && (
                <div className="mt-3 position-relative d-inline-block">
                  <img
                    src={imagenPreview}
                    alt="Vista previa"
                    className="img-preview"
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                    onClick={() => { setImagen(null); setImagenPreview(null); }}
                    title="Quitar imagen"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>

            <div className="d-flex gap-2 pt-2">
              <button
                type="submit"
                className="btn btn-success btn-lg d-flex align-items-center gap-2"
                disabled={loading}
              >
                <FaSave />
                {loading ? "Guardando..." : isEditing ? "Actualizar" : "Publicar"}
              </button>

              <Link
                to="/Eliminar_novedad"
                className="btn btn-secondary btn-lg d-flex align-items-center gap-2"
              >
                <FaArrowLeft /> Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Agregar_novedad;
