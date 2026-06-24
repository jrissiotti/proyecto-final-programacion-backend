import { EventoBase } from './EventoBase';
import { Nacimiento } from './Nacimiento';
import { Defuncion } from './Defuncion';
import { Matrimonio } from './Matrimonio';
import { Migracion } from './Migracion';
import { Genero } from '../../shared/types/arbol.types';

export class Persona {
  private _id: string;
  private _nombre: string;
  private _apellido: string;
  private _genero: Genero;
  private _eventos: EventoBase[];
  private _fechaNacimiento: Date | null;
  private _fechaDefuncion: Date | null;

  constructor(id: string, nombre: string, apellido: string, genero: Genero) {
    this._id = id;
    this._nombre = nombre;
    this._apellido = apellido;
    this._genero = genero;
    this._eventos = [];
    this._fechaNacimiento = null;
    this._fechaDefuncion = null;
  }

  get id(): string { return this._id; }
  get nombre(): string { return this._nombre; }
  get apellido(): string { return this._apellido; }
  get genero(): Genero { return this._genero; }
  get fechaNacimiento(): Date | null { return this._fechaNacimiento; }
  get fechaDefuncion(): Date | null { return this._fechaDefuncion; }

  set nombre(valor: string) { this._nombre = valor; }
  set apellido(valor: string) { this._apellido = valor; }

  agregarEvento(evento: EventoBase): void {
    this._eventos.push(evento);
    this._eventos.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
    if (evento instanceof Nacimiento) {
      this._fechaNacimiento = evento.fecha;
    }
    if (evento instanceof Defuncion) {
      this._fechaDefuncion = evento.fecha;
    }
  }

  eliminarEvento(eventoId: string): boolean {
    const index = this._eventos.findIndex(e => e.id === eventoId);
    if (index === -1) return false;
    const evento = this._eventos[index];
    evento.limpiar();
    this._eventos.splice(index, 1);
    this._recalcularFechas();
    return true;
  }

  private _recalcularFechas(): void {
    this._fechaNacimiento = null;
    this._fechaDefuncion = null;
    for (const evento of this._eventos) {
      if (evento instanceof Nacimiento) {
        this._fechaNacimiento = evento.fecha;
      }
      if (evento instanceof Defuncion) {
        this._fechaDefuncion = evento.fecha;
      }
    }
  }

  obtenerEventos(): readonly EventoBase[] {
    return [...this._eventos];
  }

  obtenerEventosPorTipo(tipo: string): EventoBase[] {
    return this._eventos.filter(e => {
      if (tipo === 'Nacimiento') return e instanceof Nacimiento;
      if (tipo === 'Matrimonio') return e instanceof Matrimonio;
      if (tipo === 'Defuncion') return e instanceof Defuncion;
      if (tipo === 'Migracion') return e instanceof Migracion;
      return false;
    });
  }

  estaViva(): boolean {
    return this._fechaDefuncion === null;
  }

  obtenerEdad(): number | null {
    if (!this._fechaNacimiento) return null;
    const fechaReferencia = this._fechaDefuncion || new Date();
    let edad = fechaReferencia.getFullYear() - this._fechaNacimiento.getFullYear();
    const mes = fechaReferencia.getMonth() - this._fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && fechaReferencia.getDate() < this._fechaNacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  limpiar(): void {
    for (const evento of this._eventos) {
      evento.limpiar();
    }
    this._eventos = [];
    this._nombre = '';
    this._apellido = '';
    this._fechaNacimiento = null;
    this._fechaDefuncion = null;
  }

  toJSON(): object {
    return {
      id: this._id,
      nombre: this._nombre,
      apellido: this._apellido,
      genero: this._genero,
      eventos: this._eventos.map(e => e.toJSON()),
      fechaNacimiento: this._fechaNacimiento ? this._fechaNacimiento.toISOString() : null,
      fechaDefuncion: this._fechaDefuncion ? this._fechaDefuncion.toISOString() : null,
      edad: this.obtenerEdad(),
      estaViva: this.estaViva()
    };
  }
}