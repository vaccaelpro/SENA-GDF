import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../css/agregar_novedad.css"

const Agregar_novedad = () => {
  // ------------------------------------------------------------------------
  // ESTADOS DEL FORMULARIO
  // ------------------------------------------------------------------------
  // Aquí declaramos las variables que almacenarán lo que el usuario escriba o seleccione.
  // Cada input está enlazado a uno de estos estados.
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState(null);
  const [url, setUrl] = useState("");

  // ------------------------------------------------------------------------
  // ENVÍO DE DATOS AL BACKEND (POST)
  // ------------------------------------------------------------------------
  // Se ejecuta cuando el usuario presiona "Publicar".
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue por defecto

    // Validaciones básicas antes de enviar
    if (!titulo || !contenido) {
      Swal.fire("Error", "El título y el contenido son obligatorios", "error");
      return;
    }

    // Como enviamos un archivo (imagen), necesitamos usar FormData en lugar de un objeto JSON normal.
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("contenido", contenido);
    formData.append("categoria", categoria);
    if (imagen) {
      formData.append("imagen", imagen); // Solo lo agrega si el usuario seleccionó un archivo
    }
    formData.append("url", url);

    try {
      // Petición POST al servidor backend
      await axios.post("http://localhost:3001/api/admin/comunicados", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire("¡Éxito!", "Novedad publicada correctamente", "success");
      
      // Limpiar el formulario
      setTitulo("");
      setContenido("");
      setCategoria("");
      setImagen(null);
      setUrl("");
      document.getElementById("imagen").value = "";
    } catch (error) {
      console.error("Error al publicar la novedad:", error);
      Swal.fire("Error", "Hubo un problema al publicar la novedad", "error");
    }
  };

    return(
    <div className="p-4" id="contenido-principal">
      <h2 className="mb-4">Nueva Publicación</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="titulo" className="form-label">Título</label>
          <input
            type="text"
            className="form-control"
            id="titulo"
            placeholder="Ingrese el título de la publicación"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="contenido" className="form-label">Contenido</label>
          <textarea
            className="form-control"
            id="contenido"
            rows="5"
            placeholder="Escriba el contenido de la publicación"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="categoria" className="form-label">Categoría</label>
          <select 
            className="form-select" 
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Seleccione una categoría</option>
            <option value="1">Noticias</option>
            <option value="2">Eventos</option>
            <option value="3">Anuncios</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="imagen" className="form-label">Imagen</label>
          <input 
            className="form-control" 
            type="file" 
            id="imagen" 
            onChange={(e) => setImagen(e.target.files[0])}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="url" className="form-label">URL (Opcional)</label>
          <input
            className="form-control"
            type="url"
            id="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">Publicar</button>
      </form>
    </div>
    );
};

export default Agregar_novedad;