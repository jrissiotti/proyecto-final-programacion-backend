export class PilaHistorial<T> {
  private _elementos: T[];
  private readonly _limite: number;

  constructor(limite: number = 100) {
    if (limite <= 0) {
      throw new Error('El límite debe ser mayor a 0');
    }
    this._limite = limite;
    this._elementos = [];
  }

  push(elemento: T): void {
    this._elementos.push(elemento);
    if (this._elementos.length > this._limite) {
      this._elementos.shift(); // FIFO: elimina el más antiguo
    }
  }

  pop(): T | undefined {
    return this._elementos.pop();
  }

  peek(): T | undefined {
    if (this._elementos.length === 0) return undefined;
    return this._elementos[this._elementos.length - 1];
  }

  obtenerTodos(): readonly T[] {
    return [...this._elementos];
  }

  estaVacia(): boolean {
    return this._elementos.length === 0;
  }

  tamano(): number {
    return this._elementos.length;
  }

  limpiar(): void {
    this._elementos = [];
  }
}