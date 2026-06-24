import { TipoRelacion } from '../../shared/types/arbol.types';
import { RelacionInvalidaException } from '../../exceptions/RelacionInvalidaException';

export class RelacionFamiliar {
  private _id: string;
  private _personaOrigenId: string;
  private _personaDestinoId: string;
  private _tipo: TipoRelacion;
  private _fechaInicio: Date | null;
  private _fechaFin: Date | null;

  constructor(
    id: string,
    personaOrigenId: string,
    personaDestinoId: string,
    tipo: TipoRelacion,
    fechaInicio: Date | null = null,
    fechaFin: Date | null = null
  ) {
    if (!['PADRE_DE', 'MADRE_DE', 'CONYUGE_DE'].includes(tipo)) {
      throw new RelacionInvalidaException(`Tipo de relación inválido: ${tipo}`);
    }
    
    this._id = id;
    this._personaOrigenId = personaOrigenId;
    this._personaDestinoId = personaDestinoId;
    this._tipo = tipo;
    this._fechaInicio = fechaInicio;
    this._fechaFin = fechaFin;
  }

  get id(): string { return this._id; }
  get personaOrigenId(): string { return this._personaOrigenId; }
  get personaDestinoId(): string { return this._personaDestinoId; }
  get tipo(): TipoRelacion { return this._tipo; }
  get fechaInicio(): Date | null { return this._fechaInicio; }
  get fechaFin(): Date | null { return this._fechaFin; }

  esActiva(): boolean {
    if (!this._fechaFin) return true;
    return this._fechaFin > new Date();
  }

  toJSON(): object {
    return {
      id: this._id,
      personaOrigenId: this._personaOrigenId,
      personaDestinoId: this._personaDestinoId,
      tipo: this._tipo,
      fechaInicio: this._fechaInicio?.toISOString() || null,
      fechaFin: this._fechaFin?.toISOString() || null,
      activa: this.esActiva()
    };
  }
}