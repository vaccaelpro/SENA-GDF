import { useState, useEffect } from "react";
import "../../css/gestion_usuarios.css";
import { BsSearch, BsPencilSquare, BsTrashFill, BsX } from "react-icons/bs";
import axios from "axios";
import Swal from "sweetalert2";

const Tabla_gestion_usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    tipo_documento: "",
    documento: "",
    celular: "",
    grupo_formacion: "",
    correo_electronico: "",
    rol: "USUARIO",
    tipo_apoyo: "regular"
  });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/admin/usuarios");
      setUsuarios(response.data);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
      setCargando(false);
    }
  };

  const handleEliminar = async (id, nombre) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a eliminar al usuario ${nombre}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/api/admin/usuarios/${id}`);
        Swal.fire('Eliminado', 'El usuario ha sido eliminado correctamente.', 'success');
        fetchUsuarios();
      } catch (error) {
        console.error("Error al eliminar:", error);
        Swal.fire('Error', 'Hubo un problema al eliminar el usuario.', 'error');
      }
    }
  };

  const handleAbrirEditar = (usuario) => {
    setUsuarioSeleccionado(usuario.id_usuario);
    setFormData({
      primer_nombre: usuario.primer_nombre,
      segundo_nombre: usuario.segundo_nombre || "",
      primer_apellido: usuario.primer_apellido,
      segundo_apellido: usuario.segundo_apellido || "",
      tipo_documento: usuario.tipo_documento,
      documento: usuario.documento,
      celular: usuario.celular,
      grupo_formacion: usuario.grupo_formacion,
      correo_electronico: usuario.correo_electronico,
      rol: usuario.rol,
      tipo_apoyo: usuario.tipo_apoyo
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUsuarioSeleccionado(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/admin/usuarios/${usuarioSeleccionado}`, formData);
      Swal.fire('Actualizado', 'Los datos del usuario han sido actualizados.', 'success');
      handleCloseModal();
      fetchUsuarios();
    } catch (error) {
      console.error("Error al actualizar:", error);
      Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const nombreCompleto = `${u.primer_nombre} ${u.segundo_nombre || ""} ${u.primer_apellido} ${u.segundo_apellido || ""}`.toLowerCase();
    const documento = u.documento.toString();
    const term = busqueda.toLowerCase();
    return nombreCompleto.includes(term) || documento.includes(term);
  });

  return (
    <>
      <br />
      <div className="p-4">
        <div className="input-group mb-4 search-container">
          <span className="input-group-text bg-white border-end-0">
            <BsSearch />
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Buscar por nombre o documento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          {cargando ? (
            <div className="text-center p-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <table className="custom-table table-hover align-middle text-center">
              <thead>
                <tr>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Tipo Doc.</th>
                  <th>Documento</th>
                  <th>Celular</th>
                  <th>Grupo Formación</th>
                  <th>Correo Electrónico</th>
                  <th>Rol</th>
                  <th>Tipo Apoyo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id_usuario}>
                      <td>{`${usuario.primer_nombre} ${usuario.segundo_nombre || ""}`}</td>
                      <td>{`${usuario.primer_apellido} ${usuario.segundo_apellido || ""}`}</td>
                      <td>{usuario.tipo_documento}</td>
                      <td>{usuario.documento}</td>
                      <td>{usuario.celular}</td>
                      <td>{usuario.grupo_formacion}</td>
                      <td>{usuario.correo_electronico}</td>
                      <td>
                        <span className={`badge ${usuario.rol === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>
                          {usuario.rol}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-success">{usuario.tipo_apoyo || 'N/A'}</span>
                      </td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            className="btn btn-edit"
                            title="Editar Usuario"
                            onClick={() => handleAbrirEditar(usuario)}
                          >
                            <BsPencilSquare />
                          </button>
                          <button
                            className="btn btn-delete"
                            title="Eliminar Usuario"
                            onClick={() => handleEliminar(usuario.id_usuario, usuario.primer_nombre)}
                          >
                            <BsTrashFill />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-muted p-4">
                      No se encontraron usuarios que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">MODIFICAR USUARIO</h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmitUpdate}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 form-group-premium">
                      <label className="form-label-premium">Primer Nombre</label>
                      <input type="text" name="primer_nombre" className="form-control form-control-premium" value={formData.primer_nombre} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 form-group-premium">
                      <label className="form-label-premium">Segundo Nombre</label>
                      <input type="text" name="segundo_nombre" className="form-control form-control-premium" value={formData.segundo_nombre} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 form-group-premium">
                      <label className="form-label-premium">Primer Apellido</label>
                      <input type="text" name="primer_apellido" className="form-control form-control-premium" value={formData.primer_apellido} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 form-group-premium">
                      <label className="form-label-premium">Segundo Apellido</label>
                      <input type="text" name="segundo_apellido" className="form-control form-control-premium" value={formData.segundo_apellido} onChange={handleChange} />
                    </div>
                    <div className="col-md-4 form-group-premium">
                      <label className="form-label-premium">Tipo Documento</label>
                      <select name="tipo_documento" className="form-control form-control-premium" value={formData.tipo_documento} onChange={handleChange} required>
                        <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                        <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
                        <option value="Cédula de Extranjería">Cédula de Extranjería</option>
                      </select>
                    </div>
                    <div className="col-md-4 form-group-premium">
                      <label className="form-label-premium">Documento</label>
                      <input type="number" name="documento" className="form-control form-control-premium" value={formData.documento} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4 form-group-premium">
                      <label className="form-label-premium">Celular</label>
                      <input type="text" name="celular" className="form-control form-control-premium" value={formData.celular} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 form-group-premium">
                      <label className="form-label-premium">Grupo Formación</label>
                      <input type="text" name="grupo_formacion" className="form-control form-control-premium" value={formData.grupo_formacion} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 form-group-premium">
                      <label className="form-label-premium">Correo Electrónico</label>
                      <input type="email" name="correo_electronico" className="form-control form-control-premium" value={formData.correo_electronico} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 form-group-premium">
                      <label className="form-label-premium">Rol</label>
                      <select name="rol" className="form-control form-control-premium" value={formData.rol} onChange={handleChange} required>
                        <option value="USUARIO">Aprendiz</option>
                        <option value="ADMIN">Administrador</option>
                      </select>
                    </div>
                    <div className="col-md-6 form-group-premium">
                      <label className="form-label-premium">Tipo Apoyo</label>
                      <select name="tipo_apoyo" className="form-control form-control-premium" value={formData.tipo_apoyo} onChange={handleChange} required>
                        <option value="regular">Regular</option>
                        <option value="alimentacion">Alimentación</option>
                        <option value="transporte">Transporte</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={handleCloseModal}>Cancelar</button>
                  <button type="submit" className="btn btn-save-premium">GUARDAR CAMBIOS</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Tabla_gestion_usuarios;
