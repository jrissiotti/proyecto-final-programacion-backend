import { ArbolGenealogico } from '../../domain/services/ArbolGenealogico';
import { Persona } from '../../domain/entities/Persona';

export class BuscarPersona {
  private _arbol: ArbolGenealogico;

  constructor(arbol: ArbolGenealogico) {
    this._arbol = arbol;
  }

  ejecutar(id: string): Persona | undefined {
    return this._arbol.obtenerPersona(id);
  }

  ejecutarPorNombre(nombre: string): Persona[] {
    const query = nombre.toLowerCase();
    return this._arbol.obtenerPersonas().filter(p => 
      p.nombre.toLowerCase().includes(query) || 
      p.apellido.toLowerCase().includes(query)
    );
  }
}