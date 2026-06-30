import { ArbolGenealogico } from '../../domain/services/ArbolGenealogico';
import { Persona } from '../../domain/entities/Persona';
import { Genero } from '../../shared/types/arbol.types';
import { IArbolRepository } from '../../domain/interfaces/IArbolRepository';
import { v4 as uuidv4 } from 'uuid';

export class CrearPersona {
  private _arbol: ArbolGenealogico;
  private _repositorio: IArbolRepository;

  constructor(arbol: ArbolGenealogico, repositorio: IArbolRepository) {
    this._arbol = arbol;
    this._repositorio = repositorio;
  }

  async ejecutar(datos: { nombre: string; apellido: string; genero: Genero }): Promise<Persona> {
    const id = uuidv4();
    const persona = new Persona(id, datos.nombre, datos.apellido, datos.genero);
    this._arbol.agregarPersona(persona);
    
    await this._repositorio.guardarPersona(persona);
    
    const historial = this._arbol.obtenerHistorial();
    const ultimoCambio = historial[historial.length - 1];
    if (ultimoCambio) {
      await this._repositorio.guardarCambio(ultimoCambio);
    }
    
    return persona;
  }
}