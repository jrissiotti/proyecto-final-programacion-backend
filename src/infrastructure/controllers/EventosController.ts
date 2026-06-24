import { Request, Response } from 'express';
import { ArbolSingleton } from '../../services/ArbolSingleton';
import { ProcesadorArbol } from '../../services/ProcesadorArbol';
import { CrearEvento } from '../../applications/eventos/CrearEvento';
import { EliminarEvento } from '../../applications/eventos/EliminarEvento';
import { ListarEventos } from '../../applications/eventos/ListarEventos';
import { ValidarCronologia } from '../../applications/eventos/ValidarCronologia';
import { ExportarEventos } from '../../applications/eventos/ExportarEventos';
import { ExportarGEDCOM } from '../../applications/eventos/ExportarGEDCOM';
import { FugaCronologicaException } from '../../exceptions/FugaCronologicaException';
import { EventoInvalidoException } from '../../exceptions/EventoInvalidoException';

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

  static crear(req: Request, res: Response): void {
    try {
      const arbol = ArbolSingleton.obtenerInstancia();
      const casoUso = new CrearEvento(arbol);
      const fecha = new Date(req.body.fecha);
      const evento = casoUso.ejecutar({
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

  static eliminar(req: Request, res: Response): void {
    try {
      const arbol = ArbolSingleton.obtenerInstancia();
      const casoUso = new EliminarEvento(arbol);
      const eliminado = casoUso.ejecutar(req.params.personaId, req.params.eventoId);
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

  static async validar(_req: Request, res: Response): Promise<void> {
    try {
      const arbol = ArbolSingleton.obtenerInstancia();
      const casoUso = new ValidarCronologia(EventosController._procesador, arbol);
      const resultado = await casoUso.ejecutar();
      res.status(200).json({ data: resultado });
    } catch (err) {
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