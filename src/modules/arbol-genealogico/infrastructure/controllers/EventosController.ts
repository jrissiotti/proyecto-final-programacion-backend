import { Request, Response } from 'express';
import { ArbolSingleton } from '../../domain/services/ArbolSingleton';
import { ProcesadorArbol } from '../../domain/services/ProcesadorArbol';
import { CrearEvento } from '../../application/eventos/CrearEvento';
import { ActualizarEvento } from '../../application/eventos/ActualizarEvento';
import { EliminarEvento } from '../../application/eventos/EliminarEvento';
import { ListarEventos } from '../../application/eventos/ListarEventos';
import { ExportarEventos } from '../../application/eventos/ExportarEventos';
import { ExportarGEDCOM } from '../../application/eventos/ExportarGEDCOM';
import { FugaCronologicaException } from '../../domain/exceptions/FugaCronologicaException';
import { EventoInvalidoException } from '../../domain/exceptions/EventoInvalidoException';

export class EventosController {
  private static _procesador: ProcesadorArbol = new ProcesadorArbol();

  static listar(req: Request, res: Response): void {
    try {
      const arbol = ArbolSingleton.obtenerInstancia();
      const casoUso = new ListarEventos(arbol);
      const eventos = casoUso.ejecutar(req.params.personaId);
      res.status(200).json({ data: eventos.map(e => e.toJSON()) });
    } catch (err) {
      if (err instanceof EventoInvalidoException) {
        res.status(404).json({ error: err.message });
        return;
      }
      res.status(500).json({ error: 'Error interno' });
    }
  }

  static async crear(req: Request, res: Response): Promise<void> {
    try {
      const arbol = ArbolSingleton.obtenerInstancia();
      const repo = ArbolSingleton.obtenerRepositorio();
      const casoUso = new CrearEvento(arbol, repo);
      const fecha = new Date(req.body.fecha);
      const evento = await casoUso.ejecutar({
        personaId: req.params.personaId,
        tipo: req.body.tipo,
        fecha: fecha,
        descripcion: req.body.descripcion,
        ubicacion: req.body.ubicacion
      });
      res.status(201).json({ data: evento.toJSON() });
    } catch (err) {
      if (err instanceof FugaCronologicaException) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (err instanceof EventoInvalidoException) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(500).json({ error: 'Error interno' });
    }
  }

  static async actualizar(req: Request, res: Response): Promise<void> {
    try {
      const arbol = ArbolSingleton.obtenerInstancia();
      const repo = ArbolSingleton.obtenerRepositorio();
      const casoUso = new ActualizarEvento(arbol, repo);
      const fecha = new Date(req.body.fecha);
      const evento = await casoUso.ejecutar({
        personaId: req.params.personaId,
        eventoId: req.params.eventoId,
        tipo: req.body.tipo,
        fecha: fecha,
        descripcion: req.body.descripcion,
        ubicacion: req.body.ubicacion
      });
      res.status(200).json({ data: evento.toJSON() });
    } catch (err) {
      if (err instanceof FugaCronologicaException) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (err instanceof EventoInvalidoException) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(500).json({ error: 'Error interno al actualizar evento' });
    }
  }

  static async eliminar(req: Request, res: Response): Promise<void> {
    try {
      const arbol = ArbolSingleton.obtenerInstancia();
      const repo = ArbolSingleton.obtenerRepositorio();
      const casoUso = new EliminarEvento(arbol, repo);
      const eliminado = await casoUso.ejecutar(req.params.personaId, req.params.eventoId);
      if (!eliminado) {
        res.status(404).json({ error: 'Evento no encontrado' });
        return;
      }
      res.status(200).json({ data: { eliminado: true } });
    } catch (err) {
      if (err instanceof EventoInvalidoException) {
        res.status(404).json({ error: err.message });
        return;
      }
      res.status(500).json({ error: 'Error interno' });
    }
  }

  static exportar(req: Request, res: Response): void {
    try {
      const arbol = ArbolSingleton.obtenerInstancia();
      const formato = req.params.formato as 'json' | 'csv';
      const personaId = req.query.personaId as string | undefined;
      const casoUso = new ExportarEventos(arbol);
      const contenido = casoUso.ejecutar(formato, personaId);
      const mimeType = formato === 'csv' ? 'text/csv' : 'application/json';
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="eventos.${formato}"`);
      res.status(200).send(contenido);
    } catch (err) {
      if (err instanceof EventoInvalidoException) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(500).json({ error: 'Error interno' });
    }
  }

  static exportarGEDCOM(_req: Request, res: Response): void {
    try {
      const arbol = ArbolSingleton.obtenerInstancia();
      const casoUso = new ExportarGEDCOM(arbol);
      const contenido = casoUso.ejecutar();
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename="arbol.ged"');
      res.status(200).send(contenido);
    } catch (err) {
      res.status(500).json({ error: 'Error interno' });
    }
  }

  static historial(_req: Request, res: Response): void {
    try {
      const arbol = ArbolSingleton.obtenerInstancia();
      const historial = arbol.obtenerHistorial();
      res.status(200).json({ data: historial });
    } catch (err) {
      res.status(500).json({ error: 'Error interno' });
    }
  }
}