import { ArbolGenealogico } from '../../services/ArbolGenealogico';
import { Persona } from '../../domain/entities/Persona';
import { Genero } from '../../shared/types/arbol.types';
import { v4 as uuidv4 } from 'uuid';

export class CrearPersona {
  private _arbol: ArbolGenealogico;

  constructor(arbol: ArbolGenealogico) {
    this._arbol = arbol;
  }

  ejecutar(datos: { nombre: string; apellido: string; genero: Genero }): Persona {
    const id = uuidv4();
    const persona = new Persona(id, datos.nombre, datos.apellido, datos.genero);
    this._arbol.agregarPersona(persona);
    return persona;
  }
}