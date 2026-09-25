/**
 * Gestión de Usuarios JPA (Admin)
 *
 * CRUD completo contra el microservicio Spring Boot/JPA de usuarios
 * (contrato: API_FRONTEND_GUIDE.md / docs_API/DOCUMENTATION.md).
 *
 * A diferencia de la vista clásica (backend Express), esta vista pagina
 * DEL LADO DEL SERVIDOR con el envelope { content, page }: la API fija
 * el tamaño de página en 7, y la paginación se conduce con
 * page.number / page.totalPages, nunca con lo que pedimos.
 * La búsqueda usa el endpoint OR (nombre, apellido o documento).
 */
import { useState, useEffect } from "react";
import "../../css/gestion_usuarios.css";
import "../../css/gestion_usuarios_jpa.css";
import {
  BsSearch,
  BsPencilSquare,
  BsTrashFill,
  BsPlusCircle,
  BsExclamationTriangle,
  BsArrowClockwise,
} from "react-icons/bs";
import {
  listarUsuariosJpa,
  buscarUsuariosJpa,
  crearUsuarioJpa,
  actualizarUsuarioJpa,
  eliminarUsuarioJpa,
} from "../../services/admin/usuariosJpa.service";
import Swal from "sweetalert2";
import {
  validateOnlyLetters,
  validateOptionalLetters,
  validateOnlyNumbers,
  validateEmail,
} from "../../utils/validators";

const FORM_INICIAL = {
  primerNombre: "",
  segundoNombre: "",
  primerApellido: "",
  segundoApellido: "",
  tipoDocumento: "CC",
  documento: "",
  celular: "",
  grupoFormacion: "",
  correoElectronico: "",
  contrasena: "",
  rol: "USUARIO",
  tipoApoyo: "N/A",
};

const GestionUsuariosJpa = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [termino, setTermino] = useState(""); // búsqueda con debounce
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Paginación del lado del servidor (0-based, como la API)
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalElementos, setTotalElementos] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [modo, setModo] = useState("crear"); // "crear" | "editar"
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [formData, setFormData] = useState(FORM_INICIAL);
  const [formErrors, setFormErrors] = useState({});
  const [guardando, setGuardando] = useState(false);

  // Debounce de la búsqueda (~350 ms)
  useEffect(() => {
    const timer = setTimeout(() => setTermino(busqueda.trim()), 350);
    return () => clearTimeout(timer);
  }, [busqueda]);

  // Al cambiar el término, se vuelve a la primera página
  useEffect(() => {
    setPagina(0);
  }, [termino]);

  const cargarDatos = async (pag) => {
    setCargando(true);
    setError(null);
    try {
      const data = termino
        ? await buscarUsuariosJpa(termino, pag)
        : await listarUsuariosJpa(pag);

      const contenido = data?.content ?? [];
      const meta = data?.page ?? { number: 0, totalPages: 1, totalElements: contenido.length };

      // Página fuera de rango: la API responde 200 con contenido vacío;
      // se retrocede una página en vez de mostrar una tabla en blanco.
      if (contenido.length === 0 && meta.number > 0) {
        setPagina(meta.number - 1);
        return;
      }

      setUsuarios(contenido);
      setTotalPaginas(meta.totalPages || 1);
      setTotalElementos(meta.totalElements ?? contenido.length);
    } catch (err) {
      console.error("Error al obtener usuarios JPA:", err);
      const msg = err.message || "No se pudieron cargar los usuarios";
      setError(msg);
      Swal.fire("Error", msg, "error");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos(pagina);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina, termino]);

  const formatearFecha = (iso) => {
    if (!iso) return "—";
    const fecha = new Date(iso);
    if (isNaN(fecha.getTime())) return iso;
    return fecha.toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" });
  };

  // La API pide mínimo 8 caracteres (el validador de contraseña del proyecto
  // es más estricto y rechazaría valores que la API sí acepta).
  const validarContrasena = (valor, esCreacion) => {
    if (!valor) return esCreacion ? "La contraseña es obligatoria." : "";
    if (valor.length < 8) return "La contraseña debe tener mínimo 8 caracteres.";
    return "";
  };

  const validateField = (name, value) => {
    let err = "";
    if (name === "primerNombre") err = validateOnlyLetters(value, "El primer nombre");
    if (name === "segundoNombre") err = validateOptionalLetters(value);
    if (name === "primerApellido") err = validateOnlyLetters(value, "El primer apellido");
    if (name === "segundoApellido") err = validateOptionalLetters(value);
    if (name === "documento") err = validateOnlyNumbers(value, "El documento", 6, 11);
    if (name === "celular") err = validateOnlyNumbers(value, "El celular", 10, 10);
    if (name === "correoElectronico") err = validateEmail(value);
    if (name === "contrasena") err = validarContrasena(value, modo === "crear");

    setFormErrors((prev) => ({ ...prev, [name]: err }));
    return err;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleAbrirCrear = () => {
    setModo("crear");
    setUsuarioSeleccionado(null);
    setFormData(FORM_INICIAL);
    setFormErrors({});
    setShowModal(true);
  };

  const handleAbrirEditar = (usuario) => {
    setModo("editar");
    setUsuarioSeleccionado(usuario.id);
    setFormData({
      primerNombre: usuario.primerNombre ?? "",
      segundoNombre: usuario.segundoNombre ?? "",
      primerApellido: usuario.primerApellido ?? "",
      segundoApellido: usuario.segundoApellido ?? "",
      tipoDocumento: usuario.tipoDocumento ?? "CC",
      documento: usuario.documento ?? "",
      celular: usuario.celular ?? "",
      grupoFormacion: usuario.grupoFormacion ?? "",
      correoElectronico: usuario.correoElectronico ?? "",
      contrasena: "",
      rol: usuario.rol ?? "USUARIO",
      tipoApoyo: usuario.tipoApoyo ?? "N/A",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUsuarioSeleccionado(null);
    setFormErrors({});
    setGuardando(false);
  };

  // La API espera null (no cadenas vacías) en los campos opcionales
  const construirPayload = () => {
    const limpio = (v) => (typeof v === "string" && v.trim() !== "" ? v.trim() : null);

    const payload = {
      primerNombre: formData.primerNombre.trim(),
      segundoNombre: limpio(formData.segundoNombre),
      primerApellido: formData.primerApellido.trim(),
      segundoApellido: limpio(formData.segundoApellido),
      tipoDocumento: formData.tipoDocumento,
      documento: Number(formData.documento),
      celular: formData.celular.trim(),
      grupoFormacion: limpio(formData.grupoFormacion),
      correoElectronico: formData.correoElectronico.trim(),
      rol: formData.rol || "USUARIO",
      tipoApoyo:
        !formData.tipoApoyo || formData.tipoApoyo === "N/A" ? null : formData.tipoApoyo,
    };

    // contrasena: obligatoria al crear; en edición, vacía = conservar la actual
    if (modo === "crear" || formData.contrasena.trim() !== "") {
      payload.contrasena = formData.contrasena;
    }
    return payload;
  };

  // Marca en el formulario el campo que la API reportó como conflictivo (409)
  const marcarConflicto = (mensaje) => {
    const msg = (mensaje || "").toLowerCase();
    if (msg.includes("documento")) {
      setFormErrors((prev) => ({ ...prev, documento: mensaje }));
    } else if (msg.includes("correo") || msg.includes("email")) {
      setFormErrors((prev) => ({ ...prev, correoElectronico: mensaje }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const camposAValidar = [
      "primerNombre",
      "segundoNombre",
      "primerApellido",
      "segundoApellido",
      "documento",
      "celular",
      "correoElectronico",
      "contrasena",
    ];

    let hasError = false;
    camposAValidar.forEach((campo) => {
      const err = validateField(campo, formData[campo]);
      if (err) hasError = true;
    });

    if (hasError) {
      Swal.fire("Validación", "Por favor corrige los datos inválidos en el formulario.", "warning");
      return;
    }

    setGuardando(true);
    try {
      if (modo === "crear") {
        await crearUsuarioJpa(construirPayload());
        Swal.fire({
          icon: "success",
          title: "Usuario creado",
          text: "El usuario fue registrado en el microservicio JPA.",
          confirmButtonColor: "#28a745",
        });
        handleCloseModal();
        setPagina(0);
        cargarDatos(0);
      } else {
        await actualizarUsuarioJpa(usuarioSeleccionado, construirPayload());
        Swal.fire({
          icon: "success",
          title: "Actualizado",
          text: "Los datos del usuario han sido actualizados.",
          confirmButtonColor: "#28a745",
        });
        handleCloseModal();
        cargarDatos(pagina);
      }
    } catch (err) {
      console.error(`Error al ${modo === "crear" ? "crear" : "actualizar"} (JPA):`, err);
      if (err.status === 409) {
        marcarConflicto(err.message);
        // Cuando la BD dispara la restricción (y no el service check), la API
        // responde el mensaje genérico "Uniqueness conflict" sin nombrar el campo.
        const msg = /uniqueness conflict/i.test(err.message)
          ? "Ya existe un usuario con ese documento o correo electrónico en el microservicio JPA. Cambia uno de los dos e inténtalo de nuevo."
          : err.message;
        Swal.fire("Conflicto", msg, "warning");
      } else if (err.status === 0) {
        // Sin respuesta del servidor (timeout o red): en un POST el registro
        // pudo haberse creado igual. Se recarga la lista para mostrar la
        // verdad actual y que el admin no reintente a ciegas.
        handleCloseModal();
        setPagina(0);
        cargarDatos(0);
        Swal.fire("Sin respuesta del servicio", err.message, "warning");
      } else {
        Swal.fire("Error", err.message || "No se pudo guardar el usuario.", "error");
      }
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id, nombre) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Vas a eliminar al usuario ${nombre}. Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await eliminarUsuarioJpa(id);
        Swal.fire("Eliminado", "El usuario ha sido eliminado correctamente.", "success");
        cargarDatos(pagina);
      } catch (err) {
        console.error("Error al eliminar (JPA):", err);
        Swal.fire("Error", err.message || "Hubo un problema al eliminar el usuario.", "error");
      }
    }
  };

  const indiceInicio = pagina * 7;

  return (
    <>
      <br />
      <div className="p-4">
        <div className="jpa-toolbar mb-4">
          <div className="input-group search-container">
            <span className="input-group-text bg-white border-end-0">
              <BsSearch />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Buscar por nombre, apellido o documento..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button type="button" className="btn-new-user" onClick={handleAbrirCrear}>
            <BsPlusCircle className="me-2" />
            Nuevo Usuario
          </button>
        </div>

        <div className="table-responsive">
          {cargando ? (
            <div className="text-center p-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : error ? (
            <div className="jpa-error-alert" role="alert">
              <BsExclamationTriangle className="jpa-error-icon" />
              <p className="jpa-error-text mb-0">{error}</p>
              <button type="button" className="btn-retry" onClick={() => cargarDatos(pagina)}>
                <BsArrowClockwise className="me-2" />
                Reintentar
              </button>
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
                  <th>Última Actualización</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length > 0 ? (
                  usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>{`${usuario.primerNombre} ${usuario.segundoNombre || ""}`}</td>
                      <td>{`${usuario.primerApellido} ${usuario.segundoApellido || ""}`}</td>
                      <td>
                        <span className="badge bg-secondary">{usuario.tipoDocumento}</span>
                      </td>
                      <td>{usuario.documento}</td>
                      <td>{usuario.celular}</td>
                      <td>{usuario.grupoFormacion || "—"}</td>
                      <td>{usuario.correoElectronico}</td>
                      <td>
                        <span className={`badge ${usuario.rol === "ADMIN" ? "bg-danger" : "bg-primary"}`}>
                          {usuario.rol === "ADMIN" ? "Administrador" : "Aprendiz"}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${!usuario.tipoApoyo ? "bg-secondary" : "bg-success"}`}>
                          {usuario.tipoApoyo || "N/A"}
                        </span>
                      </td>
                      <td className="col-fecha">{formatearFecha(usuario.ultimaActualizacion)}</td>
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
                            onClick={() => handleEliminar(usuario.id, usuario.primerNombre)}
                          >
                            <BsTrashFill />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-muted p-4">
                      No se encontraron usuarios que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Paginación del lado del servidor (la API fija el tamaño en 7) */}
        {!cargando && !error && totalElementos > 0 && (
          <div className="pagination-container">
            <small className="text-muted fw-semibold">
              Mostrando {indiceInicio + 1} a{" "}
              {Math.min(indiceInicio + usuarios.length, totalElementos)} de {totalElementos} usuarios
            </small>

            <div className="d-flex align-items-center gap-1">
              <button
                type="button"
                className="page-item-btn me-1"
                onClick={() => setPagina((prev) => Math.max(prev - 1, 0))}
                disabled={pagina === 0}
              >
                &laquo; Anterior
              </button>

              {Array.from({ length: totalPaginas }, (_, i) => i).map((numPage) => (
                <button
                  key={numPage}
                  type="button"
                  className={`page-item-btn ${pagina === numPage ? "active-btn" : ""}`}
                  onClick={() => setPagina(numPage)}
                >
                  {numPage + 1}
                </button>
              ))}

              <button
                type="button"
                className="page-item-btn ms-1"
                onClick={() => setPagina((prev) => Math.min(prev + 1, totalPaginas - 1))}
                disabled={pagina >= totalPaginas - 1}
              >
                Siguiente &raquo;
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modo === "crear" ? "CREAR USUARIO (JPA)" : "MODIFICAR USUARIO (JPA)"}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 form-group-premium">
                      <label className="form-label-premium">Primer Nombre</label>
                      <input type="text" name="primerNombre" className={`form-control form-control-premium ${formErrors.primerNombre ? "border-danger" : ""}`} value={formData.primerNombre} onChange={handleChange} required />
                      {formErrors.primerNombre && <small className="text-danger font-weight-bold d-block mt-1">⚠️ {formErrors.primerNombre}</small>}
                    </div>
                    <div className="col-md-6 form-group-premium">
                      <label className="form-label-premium">Segundo Nombre</label>
                      <input type="text" name="segundoNombre" className={`form-control form-control-premium ${formErrors.segundoNombre ? "border-danger" : ""}`} value={formData.segundoNombre} onChange={handleChange} />
                      {formErrors.segundoNombre && <small className="text-danger font-weight-bold d-block mt-1">⚠️ {formErrors.segundoNombre}</small>}
                    </div>
                    <div className="col-md-6 form-group-premium">
                      <label className="form-label-premium">Primer Apellido</label>
                      <input type="text" name="primerApellido" className={`form-control form-control-premium ${formErrors.primerApellido ? "border-danger" : ""}`} value={formData.primerApellido} onChange={handleChange} required />
                      {formErrors.primerApellido && <small className="text-danger font-weight-bold d-block mt-1">⚠️ {formErrors.primerApellido}</small>}
                    </div>
                    <div className="col-md-6 form-group-premium">
                      <label className="form-label-premium">Segundo Apellido</label>
                      <input type="text" name="segundoApellido" className={`form-control form-control-premium ${formErrors.segundoApellido ? "border-danger" : ""}`} value={formData.segundoApellido} onChange={handleChange} />
                      {formErrors.segundoApellido && <small className="text-danger font-weight-bold d-block mt-1">⚠️ {formErrors.segundoApellido}</small>}
                    </div>
                    <div className="col-md-4 form-group-premium">
                      <label className="form-label-premium">Tipo Documento</label>
                      <select name="tipoDocumento" className="form-control form-control-premium" value={formData.tipoDocumento} onChange={handleChange} required>
                        <option value="CC">Cédula de Ciudadanía (CC)</option>
                        <option value="TI">Tarjeta de Identidad (TI)</option>
                      </select>
                    </div>
                    <div className="col-md-4 form-group-premium">
                      <label className="form-label-premium">Documento</label>
                      <input type="text" name="documento" className={`form-control form-control-premium ${formErrors.documento ? "border-danger" : ""}`} value={formData.documento} onChange={handleChange} required />
                      {formErrors.documento && <small className="text-danger font-weight-bold d-block mt-1">⚠️ {formErrors.documento}</small>}
                    </div>
                    <div className="col-md-4 form-group-premium">
                      <label className="form-label-premium">Celular</label>
                      <input type="text" name="celular" className={`form-control form-control-premium ${formErrors.celular ? "border-danger" : ""}`} value={formData.celular} onChange={handleChange} required />
                      {formErrors.celular && <small className="text-danger font-weight-bold d-block mt-1">⚠️ {formErrors.celular}</small>}
                    </div>
                    <div className="col-md-6 form-group-premium">
                      <label className="form-label-premium">Grupo Formación</label>
                      <input type="text" name="grupoFormacion" className="form-control form-control-premium" value={formData.grupoFormacion} onChange={handleChange} placeholder="Ej: ADSO-2876754" />
                    </div>
                    <div className="col-md-6 form-group-premium">
                      <label className="form-label-premium">Correo Electrónico</label>
                      <input type="email" name="correoElectronico" className={`form-control form-control-premium ${formErrors.correoElectronico ? "border-danger" : ""}`} value={formData.correoElectronico} onChange={handleChange} required />
                      {formErrors.correoElectronico && <small className="text-danger font-weight-bold d-block mt-1">⚠️ {formErrors.correoElectronico}</small>}
                    </div>
                    <div className="col-md-4 form-group-premium">
                      <label className="form-label-premium">Contraseña</label>
                      <input type="password" name="contrasena" className={`form-control form-control-premium ${formErrors.contrasena ? "border-danger" : ""}`} value={formData.contrasena} onChange={handleChange} required={modo === "crear"} autoComplete="new-password" />
                      {formErrors.contrasena ? (
                        <small className="text-danger font-weight-bold d-block mt-1">⚠️ {formErrors.contrasena}</small>
                      ) : (
                        modo === "editar" && (
                          <small className="jpa-password-hint">Déjala vacía para conservar la contraseña actual.</small>
                        )
                      )}
                    </div>
                    <div className="col-md-4 form-group-premium">
                      <label className="form-label-premium">Rol</label>
                      <select name="rol" className="form-control form-control-premium" value={formData.rol} onChange={handleChange} required>
                        <option value="USUARIO">Aprendiz</option>
                        <option value="ADMIN">Administrador</option>
                      </select>
                    </div>
                    <div className="col-md-4 form-group-premium">
                      <label className="form-label-premium">Tipo Apoyo</label>
                      <select name="tipoApoyo" className="form-control form-control-premium" value={formData.tipoApoyo || "N/A"} onChange={handleChange}>
                        <option value="N/A">N/A</option>
                        <option value="regular">Regular</option>
                        <option value="alimentacion">Alimentación</option>
                        <option value="transporte">Transporte</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={handleCloseModal}>Cancelar</button>
                  <button type="submit" className="btn btn-save-premium" disabled={guardando}>
                    {guardando
                      ? "GUARDANDO..."
                      : modo === "crear"
                        ? "CREAR USUARIO"
                        : "GUARDAR CAMBIOS"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GestionUsuariosJpa;
