import "../../css/IADocument.css"

const IADocument = () => {
    return(
        <>
<div className="container p-4">
  <h2>¿Cómo aplicar a los beneficios de sostenimiento?</h2>
  <p>Los pasos para aplicar al beneficio de sostenimiento son los siguientes:</p>

  <ol>
    <li>
      Revisar los <strong>requisitos actualizados</strong> para ser beneficiario.
    </li>
    <li>Completar el formulario oficial del SENA.</li>
    <li>Enviar la solicitud y esperar la respuesta.</li>
  </ol>

  <a
    href="https://centrotgi.blogspot.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="btn btn-success"
  >
    Ir a Formularios Oficiales
  </a>

  <hr />

  <h4>Requisitos</h4>
  <ul>
    <li>Estar matriculado en un programa del SENA.</li>
    <li>No tener otro subsidio similar.</li>
    <li>Cumplir con la asistencia mínima requerida.</li>
  </ul>
</div>

<div className="contenedor-bot">
  <div className="headerbot p-2">
    <h3 className="Titulo-bot">Bot Bienestar Aprendiz</h3>
  </div>

  <div className="chat-body">
    <p className="mensaje-bot">
      Hola, soy tu asistente. ¿En qué puedo ayudarte?
    </p>
  </div>

  <div className="input-area">
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        placeholder="Escribe un mensaje"
      />
      <button type="button" className="btn btn-success">
        Enviar
      </button>
    </div>
  </div>
</div>

        </>
    );
};

export default IADocument;