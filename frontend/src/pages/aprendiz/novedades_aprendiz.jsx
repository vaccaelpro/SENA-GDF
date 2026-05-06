import "../../css/novedades_aprendiz.css";
import Publicacion1 from "../../assets/img/publicacion1.jpg";
import Publicacion2 from "../../assets/img/publicacion2.jpg";
import Publicacion3 from "../../assets/img/publicacion3.jpg";
import Publicacion4 from "../../assets/img/publicacion4.jpg";

const Novedades_aprendiz = () => {
  return (
    <div className="container mt-5">
      <h3 className="mb-4">Publicaciones</h3>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 g-4">
        <div className="col mb-4">
          <div className="card h-100 text-center">
            <img
              src={Publicacion1}
              className="card-img-top"
              alt="Imagen de publicación"
            />
            <div className="card-body">
              <h5 className="card-title">
                Convocatoria de Apoyo de Sostenimiento 2024
              </h5>
              <p className="card-text">
                Material institucional del Centro Textil y de Gestión Industrial
                que acompaña la difusión de la Convocatoria de Apoyo de
                Sostenimiento 2024. La pieza promueve la participación de los
                aprendices en el proceso de postulación, destacando la
                disponibilidad de apoyos económicos destinados a facilitar su
                permanencia y continuidad en la formación. La imagen refuerza el
                mensaje institucional mediante elementos visuales alusivos a la
                identidad del SENA.
              </p>
            </div>
          </div>
        </div>

        <div className="col mb-4">
          <div className="card h-100 text-center">
            <img
              src={Publicacion2}
              className="card-img-top"
              alt="Imagen de publicación"
            />
            <div className="card-body">
              <h5 className="card-title">
                Jornada de Salud y Bienestar Integral
              </h5>
              <p className="card-text">
                Comunicación oficial del Centro Textil y de Gestión Industrial
                destinada a instructores y aprendices, en la que se resalta la
                importancia de consultar y diligenciar el Formato de Paz y Salvo
                de finalización de Etapa Productiva. La pieza se complementa con
                la invitación a la Jornada de Salud y Bienestar Integral.
              </p>
            </div>
          </div>
        </div>

        <div className="col mb-4">
          <div className="card h-100 text-center">
            <img
              src={Publicacion3}
              className="card-img-top"
              alt="Imagen de publicación"
            />
            <div className="card-body">
              <h5 className="card-title">Necesidades para aprendices.</h5>
              <p className="card-text">
                Material informativo del programa Bienestar al Aprendiz que
                invita a los estudiantes a participar en la encuesta
                institucional de necesidades. La campaña promueve la
                colaboración y el apoyo mutuo entre los aprendices.
              </p>
            </div>
          </div>
        </div>

        <div className="col mb-4">
          <div className="card h-100 text-center">
            <img
              src={Publicacion4}
              className="card-img-top"
              alt="Imagen de publicación"
            />
            <div className="card-body">
              <h5 className="card-title">Nueva oferta presencial SENA</h5>
              <p className="card-text">
                Anuncio institucional del SENA que comunica la disponibilidad de
                una nueva oferta formativa presencial e invita a los interesados
                a realizar su inscripción a través de la plataforma oficial
                Sofiaplus.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Novedades_aprendiz;
