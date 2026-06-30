import { EventoBase } from './EventoBase';
import { Ubicacion } from './Ubicacion';

export class Nacimiento extends EventoBase {
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
    return `Nacimiento registrado: nueva persona ingresada al árbol genealógico el ${this._fecha.toISOString().split('T')[0]}`;
  }

  toJSON(): object {
    return {
      id: this._id,
      personaId: this._personaId,
      tipo: 'Nacimiento',
      fecha: this._fecha.toISOString(),
      descripcion: this._descripcion,
      ubicacion: this._ubicacion.toJSON(),
      impacto: this.procesarImpacto()
    };
  }
}