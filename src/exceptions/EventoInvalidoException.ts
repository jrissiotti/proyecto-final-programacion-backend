export class EventoInvalidoException extends Error {
  constructor(mensaje: string) {
    super(`[VALIDACION] ${mensaje}`);
    this.name = 'EventoInvalidoException';
    (Error as any).captureStackTrace(this, EventoInvalidoException);
  }
}