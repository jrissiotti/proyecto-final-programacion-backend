export class Ubicacion {
  private readonly _nombre: string;

  constructor(nombre: string) {
    this._nombre = nombre;
  }

  get nombre(): string {
    return this._nombre;
  }

  toJSON(): object {
    return {
      nombre: this._nombre
    };
  }
}