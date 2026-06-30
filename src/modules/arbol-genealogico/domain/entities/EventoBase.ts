import { Ubicacion } from './Ubicacion';
import { FugaCronologicaException } from '../exceptions/FugaCronologicaException';

export abstract class EventoBase {
  protected _id: string;
  protected _personaId: string;
  protected _fecha: Date;
  protected _descripcion: string;
  protected _ubicacion: Ubicacion;

  constructor(
    id: string,
    personaId: string,
    fecha: Date,
    descripcion: string,
    ubicacion: Ubicacion
  ) {
    this._id = id;
    this._personaId = personaId;
    this._fecha = fecha;
    this._descripcion = descripcion;
    this._ubicacion = ubicacion;
    this.validarCronologia();
  }

  get id(): string { return this._id; }
  get personaId(): string { return this._personaId; }
  get fecha(): Date { return this._fecha; }
  get descripcion(): string { return this._descripcion; }
  get ubicacion(): Ubicacion { return this._ubicacion; }

  set descripcion(valor: string) {
    this._descripcion = valor;
  }

  set fecha(valor: Date) {
    this._fecha = valor;
    this.validarCronologia();
  }

  set ubicacion(valor: Ubicacion) {
    this._ubicacion = valor;
  }

  abstract procesarImpacto(): string;

  validarCronologia(): boolean {
    const ahora = new Date();
    if (this._fecha > ahora) {
      throw new FugaCronologicaException('La fecha del evento no puede ser futura');
    }
    return true;
  }

  limpiar(): void {
    this._descripcion = '';
    (this._ubicacion as any) = null;
  }

  abstract toJSON(): object;
}