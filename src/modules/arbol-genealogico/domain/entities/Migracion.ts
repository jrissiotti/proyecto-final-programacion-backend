import { EventoBase } from './EventoBase';
import { Ubicacion } from './Ubicacion';

export class Migracion extends EventoBase {
  constructor(
    id: string,
    personaId: string,
    fecha: Date,
    descripcion: string,
    ubicacion: Ubicacion
  ) {
    super(id, personaId, fecha, descripcion, ubicacion);
  }

  procesarImpacto(): string {
    return `Migración registrada: cambio de ubicación el ${this._fecha.toISOString().split('T')[0]} hacia ${this._ubicacion.nombre}`;
  }

  toJSON(): object {
    return {
      id: this._id,
      personaId: this._personaId,
      tipo: 'Migracion',
      fecha: this._fecha.toISOString(),
      descripcion: this._descripcion,
      ubicacion: this._ubicacion.toJSON(),
      impacto: this.procesarImpacto()
    };
  }
}