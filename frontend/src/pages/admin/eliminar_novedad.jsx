import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../css/eliminar_novedad.css"
import Publicacion1 from "../../assets/img/publicacion1.jpg";

const Eliminar_novedad = () => {
  // ------------------------------------------------------------------------
  // ESTADOS PRINCIPALES DE LA PÁGINA
  // ------------------------------------------------------------------------
  const [comunicados, setComunicados] = useState([]); // Almacena la lista de novedades traídas de la BD
  const [cargando, setCargando] = useState(true); // Controla si se muestra el spinner de carga

  // ------------------------------------------------------------------------
  // ESTADOS PARA EL MODAL DE EDICIÓN
  // ------------------------------------------------------------------------
  // Hice un modal para que se viera como que más dinámico y así.
  // Estas variables controlan la ventana emergente y sus datos al momento de modificar.
  const [showModal, setShowModal] = useState(false);
  const [comunicadoSeleccionado, setComunicadoSeleccionado] = useState(null); // ID del comunicado a editar
  const [formData, setFormData] = useState({
    titulo: "",
    contenido: "",
    categoria: "",
    url: ""
  });
  const [nuevaImagen, setNuevaImagen] = useState(null); // Guarda el nuevo archivo de imagen (si decide subirlo)

  // ------------------------------------------------------------------------
  // CARGA INICIAL (LEER DATOS)
  // ------------------------------------------------------------------------
  // useEffect hace que esta función se ejecute ni bien carga la página.
  useEffect(() => {
    fetchComunicados();
  }, []);

  // Función para pedirle al backend (GET) todas las novedades guardadas
  const fetchComunicados = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/admin/comunicados");
      setComunicados(response.data);
      setCargando(false);
    } catch (error) {
      console.error("Error al cargar comunicados:", error);
      Swal.fire("Error", "No se pudieron cargar las publicaciones", "error");
      setCargando(false);
    }
  };

  // ------------------------------------------------------------------------
  // ELIMINAR NOVEDAD (DELETE)
  // ------------------------------------------------------------------------
  // Función conectada al botón rojo "Borrar".
  const handleBorrar = async (id) => {
    // Primero, confirmamos con el usuario mediante una ventana SweetAlert
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Vas a eliminar esta publicación. Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/api/admin/comunicados/${id}`);
        Swal.fire('Eliminado', 'La publicación ha sido eliminada.', 'success');
        fetchComunicados(); // Recargar lista
      } catch (error) {
        console.error("Error al eliminar:", error);
        Swal.fire('Error', 'Hubo un problema al eliminar la publicación.', 'error');
      }
    }
  };

  // ------------------------------------------------------------------------
  // ABRIR MODAL (PREPARAR EDICIÓN)
  // ------------------------------------------------------------------------
  // Cuando se hace clic en "Modificar", rellenamos los estados con los datos que ya tenía el comunicado
  const handleAbrirModificar = (comunicado) => {
    setComunicadoSeleccionado(comunicado.id_comunicado);
    setFormData({
      titulo: comunicado.titulo,
      contenido: comunicado.contenido,
      categoria: comunicado.categoria || "",
      url: comunicado.url || ""
    });
    setNuevaImagen(null);
    setShowModal(true); // Muestra el modal en pantalla
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setComunicadoSeleccionado(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ------------------------------------------------------------------------
  // GUARDAR EDICIÓN (PUT)
  // ------------------------------------------------------------------------
  // Función conectada al botón "Guardar Cambios" dentro del Modal
  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      // Como puede haber una nueva imagen, de nuevo usamos FormData
      const updateData = new FormData();
      updateData.append("titulo", formData.titulo);
      updateData.append("contenido", formData.contenido);
      updateData.append("categoria", formData.categoria);
      updateData.append("url", formData.url);
      
      // Si el usuario eligió otra imagen, la agregamos
      if (nuevaImagen) {
        updateData.append("imagen", nuevaImagen);
      }

      // Petición PUT (Actualizar) enviada al backend
      await axios.put(`http://localhost:3001/api/admin/comunicados/${comunicadoSeleccionado}`, updateData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      Swal.fire('Actualizado', 'La publicación ha sido actualizada.', 'success');
      handleCloseModal();
      fetchComunicados();
    } catch (error) {
      console.error("Error al actualizar:", error);
      Swal.fire('Error', 'No se pudo actualizar la publicación.', 'error');
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Publicaciones</h3>
      
      {cargando ? (
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 g-4">
          {comunicados.length > 0 ? (
            comunicados.map((comunicado) => (
              <div className="col mb-4" key={comunicado.id_comunicado}>
                <div className="card h-100 text-center">
                  <img 
                    src={comunicado.imagen ? `http://localhost:3001/uploads/${comunicado.imagen}` : Publicacion1} 
                    className="card-img-top" 
                    alt="Imagen de publicación" 
                    style={{ maxHeight: "300px", objectFit: "cover" }}
                    onError={(e) => { e.target.src = Publicacion1 }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{comunicado.titulo}</h5>
                    <p className="card-text">{comunicado.contenido}</p>
                    {comunicado.url && (
                      <a href={comunicado.url} target="_blank" rel="noreferrer" className="btn btn-link mb-2">Ver más (URL)</a>
                    )}
                    <div className="d-flex justify-content-center gap-2 mt-3">
                      <button className="btn btn-success" onClick={() => handleAbrirModificar(comunicado)}>Modificar</button>
                      <button className="btn btn-danger" onClick={() => handleBorrar(comunicado.id_comunicado)}>Borrar</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p className="text-muted">No hay publicaciones registradas.</p>
            </div>
          )}
        </div>
      )}

      {/* MODAL DE EDICIÓN */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modificar Publicación</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmitUpdate}>
                <div className="modal-body text-start">
                  <div className="mb-3">
                    <label className="form-label">Título</label>
                    <input type="text" name="titulo" className="form-control" value={formData.titulo} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contenido</label>
                    <textarea name="contenido" className="form-control" rows="4" value={formData.contenido} onChange={handleChange} required></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Categoría</label>
                    <select name="categoria" className="form-select" value={formData.categoria} onChange={handleChange}>
                      <option value="">Seleccione una categoría</option>
                      <option value="1">Noticias</option>
                      <option value="2">Eventos</option>
                      <option value="3">Anuncios</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nueva Imagen (Opcional)</label>
                    <input type="file" className="form-control" onChange={(e) => setNuevaImagen(e.target.files[0])} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">URL (Opcional)</label>
                    <input type="url" name="url" className="form-control" value={formData.url} onChange={handleChange} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                  <button type="submit" className="btn btn-success">Guardar Cambios</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Eliminar_novedad;