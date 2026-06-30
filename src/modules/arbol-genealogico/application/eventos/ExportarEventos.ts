import { ArbolGenealogico } from '../../domain/services/ArbolGenealogico';
import { ExportadorJSON } from '../../infrastructure/exportadores/ExportadorJSON';
import { ExportadorCSV } from '../../infrastructure/exportadores/ExportadorCSV';
import { EventoInvalidoException } from '../../domain/exceptions/EventoInvalidoException';
import { Persona } from '../../domain/entities/Persona';

export class ExportarEventos {
  private _arbol: ArbolGenealogico;

  constructor(arbol: ArbolGenealogico) {
    this._arbol = arbol;
  }

  ejecutar(formato: 'json' | 'csv', personaId?: string): string {
    let personas: Persona[] = [];
    if (personaId) {
      const p = this._arbol.obtenerPersona(personaId);
      if (p) personas.push(p);
    } else {
      personas = [...this._arbol.obtenerPersonas()];
    }

    if (personas.length === 0) {
      throw new EventoInvalidoException(`Persona no encontrada: ${personaId}`);
    }

    let eventos = personas.flatMap(p => p.obtenerEventos());
    const eventosArray = [...eventos];

    switch (formato) {
      case 'json':
        return new ExportadorJSON().exportar(personas);
      case 'csv':
        return new ExportadorCSV().exportar(eventosArray);
      default:
        throw new EventoInvalidoException(`Formato inválido: ${formato}`);
    }
  }
}