import "../../css/agregar_novedad.css"

const Agregar_novedad = () => {
    return(
    <div className="p-4" id="contenido-principal">
      <h2 className="mb-4">Nueva Publicación</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="titulo" className="form-label">Título</label>
          <input
            type="text"
            className="form-control"
            id="titulo"
            placeholder="Ingrese el título de la publicación"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="contenido" className="form-label">Contenido</label>
          <textarea
            className="form-control"
            id="contenido"
            rows="5"
            placeholder="Escriba el contenido de la publicación"
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="categoria" className="form-label">Categoría</label>
          <select className="form-select" id="categoria">
            <option value="">Seleccione una categoría</option>
            <option value="1">Noticias</option>
            <option value="2">Eventos</option>
            <option value="3">Anuncios</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="imagen" className="form-label">Imagen</label>
          <input className="form-control" type="file" id="imagen" />
        </div>

        <div className="mb-3">
          <label htmlFor="url" className="form-label">URL</label>
          <input
            className="form-control"
            type="url"
            id="url"
            placeholder="https://example.com"
          />
        </div>

        <button type="submit" className="btn btn-primary">Publicar</button>
      </form>
    </div>
    );
};

export default Agregar_novedad;