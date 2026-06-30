import { ArbolGenealogico } from '../../domain/services/ArbolGenealogico';
import { ExportadorJSON } from '../../infrastructure/exportadores/ExportadorJSON';
import { ExportadorCSV } from '../../infrastructure/exportadores/ExportadorCSV';
import { EventoInvalidoException } from '../../domain/exceptions/EventoInvalidoException';

export class ExportarEventos {
  private _arbol: ArbolGenealogico;

  constructor(arbol: ArbolGenealogico) {
    this._arbol = arbol;
  }

  ejecutar(formato: 'json' | 'csv', personaId?: string): string {
    let eventos = personaId 
      ? this._arbol.obtenerPersona(personaId)?.obtenerEventos() 
      : this._arbol.obtenerPersonas().flatMap(p => p.obtenerEventos());

    if (!eventos) {
      throw new EventoInvalidoException(`Persona no encontrada: ${personaId}`);
    }

    const eventosArray = [...eventos];

    switch (formato) {
      case 'json':
        return new ExportadorJSON().exportar(eventosArray);
      case 'csv':
        return new ExportadorCSV().exportar(eventosArray);
      default:
        throw new EventoInvalidoException(`Formato inválido: ${formato}`);
    }
  }
}