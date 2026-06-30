export class FugaCronologicaException extends Error {
  constructor(mensaje: string) {
    super(`[CRONOLOGIA] ${mensaje}`);
    this.name = 'FugaCronologicaException';
    (Error as any).captureStackTrace(this, FugaCronologicaException);
  }
}