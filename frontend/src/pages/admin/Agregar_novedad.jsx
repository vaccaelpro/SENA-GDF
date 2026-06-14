import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { crear, actualizar, obtenerPorId } from "../../services/admin/comunicados.service";
import Swal from "sweetalert2";
import "../../css/agregar_novedad.css";

const Agregar_novedad = () => {
  const { id } = useParams(); // Si hay id, estamos en modo edición
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

  // Cargar datos si es edición
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

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("Error", "La imagen no puede superar los 5MB", "error");
      e.target.value = "";
      return;
    }

    // Validar tipo
    if (!file.type.startsWith("image/")) {
      Swal.fire("Error", "Solo se permiten imágenes", "error");
      e.target.value = "";
      return;
    }

    setImagen(file);

    // Vista previa
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

    // Agregar usuario_id desde la sesión actual
    const usuarioStorage = localStorage.getItem("usuario");
    if (usuarioStorage) {
      const usuario = JSON.parse(usuarioStorage);
      payload.usuario_id = usuario.id_usuario;
    }

    if (isEditing && imagenPreview && !imagenPreview.startsWith("data:")) {
        // En edición, si la preview es una URL (imagen existente), mantenerla
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
    <div className="p-4" id="contenido-principal">
      <h2 className="mb-4">{isEditing ? "Editar Publicación" : "Nueva Publicación"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="titulo" className="form-label">Título</label>
          <input
            type="text"
            className="form-control"
            id="titulo"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            placeholder="Ingrese el título de la publicación"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="contenido" className="form-label">Contenido</label>
          <textarea
            className="form-control"
            id="contenido"
            name="contenido"
            rows="5"
            value={form.contenido}
            onChange={handleChange}
            placeholder="Escriba el contenido de la publicación"
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="categoria" className="form-label">Categoría</label>
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

        <div className="mb-3">
          <label htmlFor="imagen" className="form-label">Imagen</label>
          <input
            className="form-control"
            type="file"
            id="imagen"
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
          <label htmlFor="url_referencia" className="form-label">URL de referencia</label>
          <input
            className="form-control"
            type="url"
            id="url_referencia"
            name="url_referencia"
            value={form.url_referencia}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Guardando..." : isEditing ? "Actualizar" : "Publicar"}
        </button>
      </form>
    </div>
  );
};

export default Agregar_novedad;
