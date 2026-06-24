import { Request, Response, NextFunction } from 'express';
import { FugaCronologicaException } from '../../exceptions/FugaCronologicaException';
import { RelacionInvalidaException } from '../../exceptions/RelacionInvalidaException';
import { EventoInvalidoException } from '../../exceptions/EventoInvalidoException';

export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[ERROR]', err);

  if (err instanceof FugaCronologicaException) {
    res.status(400).json({ error: err.message });
    return;
  }
  if (err instanceof RelacionInvalidaException) {
    res.status(400).json({ error: err.message });
    return;
  }
  if (err instanceof EventoInvalidoException) {
    res.status(400).json({ error: err.message });
    return;
  }

  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  
  res.status(status).json({
    error: message,
    timestamp: new Date().toISOString()
  });
}