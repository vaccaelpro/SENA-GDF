import "../../css/editar_meta.css"
import { Link } from "react-router-dom";

const Editar_meta = () =>{
    return(
        <section className="formulario-editar">
  <h2>Ahorro 1</h2>

  <div className="formulario">
    <label>Nombre del ahorro:</label>
    <input type="text" placeholder="Ingresar Nombre" />

    <label>Descripción del ahorro:</label>
    <textarea placeholder="Ingresar descripción"></textarea>

    <label>Monto inicial del ahorro:</label>
    <input type="number" placeholder="Ingresar monto" />

    <Link to="/Metas_de_ahorro">
      <button className="btn-actualizar">Actualizar</button>
    </Link>
  </div>
</section>

    );
};

export default Editar_meta;