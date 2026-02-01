import "../../css/satisfaccion_encuestas.css"

const Satisfaccion_encuestas = () =>{
    return(
    <div className="containeree">
  <h2 className="mb-4 text-center text-success fw-bold">
    Encuesta de Satisfacción del Software
  </h2>

  <p className="text-center mb-5 text-muted">
    Por favor califica del 1 al 10 los siguientes aspectos de la plataforma y déjanos tus comentarios.
  </p>

  <form>
    <div className="question-card">
      <h5 className="question-title">
        1. ¿Qué tan fácil de usar te parece el software SENA GDF?
      </h5>

      <div className="mb-3">
        <label className="form-label text-muted">
          Calificación (1 = Muy difícil, 10 = Muy fácil)
        </label>

        <div className="rating-options">
          {[1,2,3,4,5,6,7,8,9,10].map(num => (
            <div className="rating-item" key={num}>
              <input type="radio" name="p1_rating" value={num} required />
              <small>{num}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Comentarios adicionales:</label>
        <textarea
          className="form-control"
          rows="2"
          placeholder="¿Por qué elegiste esa calificación?"
        />
      </div>
    </div>

    <div className="question-card">
      <h5 className="question-title">
        2. ¿Cómo calificarías el diseño visual y los colores de la aplicación?
      </h5>

      <div className="mb-3">
        <label className="form-label text-muted">
          Calificación (1 = No me gusta, 10 = Me encanta)
        </label>

        <div className="rating-options">
          {[1,2,3,4,5,6,7,8,9,10].map(num => (
            <div className="rating-item" key={num}>
              <input type="radio" name="p2_rating" value={num} required />
              <small>{num}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Comentarios adicionales:</label>
        <textarea
          className="form-control"
          rows="2"
          placeholder="Sugerencias de diseño..."
        />
      </div>
    </div>

    <div className="question-card">
      <h5 className="question-title">
        3. ¿Qué tan rápida y fluida sientes la plataforma?
      </h5>

      <div className="mb-3">
        <label className="form-label text-muted">
          Calificación (1 = Muy lenta, 10 = Muy rápida)
        </label>

        <div className="rating-options">
          {[1,2,3,4,5,6,7,8,9,10].map(num => (
            <div className="rating-item" key={num}>
              <input type="radio" name="p3_rating" value={num} required />
              <small>{num}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Comentarios adicionales:</label>
        <textarea
          className="form-control"
          rows="2"
          placeholder="¿Has notado lentitud en alguna parte?"
        />
      </div>
    </div>

    <div className="question-card">
      <h5 className="question-title">
        4. ¿Qué tan útiles son las herramientas financieras proporcionadas?
      </h5>

      <div className="mb-3">
        <label className="form-label text-muted">
          Calificación (1 = Nada útiles, 10 = Muy útiles)
        </label>

        <div className="rating-options">
          {[1,2,3,4,5,6,7,8,9,10].map(num => (
            <div className="rating-item" key={num}>
              <input type="radio" name="p4_rating" value={num} required />
              <small>{num}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Comentarios adicionales:</label>
        <textarea
          className="form-control"
          rows="2"
          placeholder="¿Qué herramienta mejorarías?"
        />
      </div>
    </div>

    <div className="text-center mt-4 mb-5">
      <button type="submit" className="btn btn-success btn-lg px-5">
        Enviar Encuesta
      </button>
    </div>

  </form>
</div>

    );
};

export default Satisfaccion_encuestas;