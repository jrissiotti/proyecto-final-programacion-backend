export class RelacionInvalidaException extends Error {
  constructor(mensaje: string) {
    super(`[RELACION] ${mensaje}`);
    this.name = 'RelacionInvalidaException';
    (Error as any).captureStackTrace(this, RelacionInvalidaException);
  }
}