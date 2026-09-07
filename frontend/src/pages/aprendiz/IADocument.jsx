import "../../css/IADocument.css";
import ValidadorMetro from "../../components/aprendiz/ValidadorMetro";

/**
 * Página IADocument — Validador IA de Documentos Metro de Medellín
 * El ValidadorMetro gestiona internamente: subir, analizar, guía e historial.
 */
const IADocument = () => {
  return (
    <div className="iadocument-page">
      <div className="iadocument-hero">
        <div className="iadocument-hero-content">
          <span className="iadocument-badge">
            🤖 Powered by Gemini Vision AI
          </span>
          <h1 className="iadocument-title">
            Validador Inteligente de Formularios Metro
          </h1>
          <p className="iadocument-subtitle">
            Sube tu formulario diligenciado del Metro de Medellín y nuestra IA
            lo auditará en segundos, detectando errores y orientándote en la corrección.
          </p>
        </div>
      </div>

      <div className="iadocument-body container-fluid px-4 pb-5">
        <ValidadorMetro />
      </div>
    </div>
  );
};

export default IADocument;