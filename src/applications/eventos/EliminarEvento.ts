import { ArbolGenealogico } from '../../services/ArbolGenealogico';
import { EventoInvalidoException } from '../../exceptions/EventoInvalidoException';

export class EliminarEvento {
  private _arbol: ArbolGenealogico;

  constructor(arbol: ArbolGenealogico) {
    this._arbol = arbol;
  }

  ejecutar(personaId: string, eventoId: string): boolean {
    const persona = this._arbol.obtenerPersona(personaId);
    if (!persona) {
      throw new EventoInvalidoException(`Persona no encontrada: ${personaId}`);
    }
    return persona.eliminarEvento(eventoId);
  }
}