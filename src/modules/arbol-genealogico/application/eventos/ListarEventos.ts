import { ArbolGenealogico } from '../../domain/services/ArbolGenealogico';
import { EventoBase } from '../../domain/entities/EventoBase';
import { EventoInvalidoException } from '../../domain/exceptions/EventoInvalidoException';

export class ListarEventos {
  private _arbol: ArbolGenealogico;

  constructor(arbol: ArbolGenealogico) {
    this._arbol = arbol;
  }

  ejecutar(personaId: string): readonly EventoBase[] {
    const persona = this._arbol.obtenerPersona(personaId);
    if (!persona) {
      throw new EventoInvalidoException(`Persona no encontrada: ${personaId}`);
    }
    return persona.obtenerEventos();
  }
}