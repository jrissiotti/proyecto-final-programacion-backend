import { ArbolGenealogico } from '../../domain/services/ArbolGenealogico';
import { EventoInvalidoException } from '../../domain/exceptions/EventoInvalidoException';
import { IArbolRepository } from '../../domain/interfaces/IArbolRepository';

export class EliminarEvento {
  private _arbol: ArbolGenealogico;
  private _repositorio: IArbolRepository;

  constructor(arbol: ArbolGenealogico, repositorio: IArbolRepository) {
    this._arbol = arbol;
    this._repositorio = repositorio;
  }

  async ejecutar(personaId: string, eventoId: string): Promise<boolean> {
    const persona = this._arbol.obtenerPersona(personaId);
    if (!persona) {
      throw new EventoInvalidoException(`Persona no encontrada: ${personaId}`);
    }
    const exito = persona.eliminarEvento(eventoId);
    if (exito) {
      await this._repositorio.guardarPersona(persona);
    }
    return exito;
  }
}