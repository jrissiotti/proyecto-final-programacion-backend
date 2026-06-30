import { Request, Response } from 'express';
import { ArbolSingleton } from '../../domain/services/ArbolSingleton';
import { CrearPersona } from '../../application/personas/CrearPersona';
import { CrearRelacion } from '../../application/personas/CrearRelacion';
import { BuscarPersona } from '../../application/personas/BuscarPersona';
import { ObtenerFamilia } from '../../application/personas/ObtenerFamilia';
import { EliminarPersona } from '../../application/personas/EliminarPersona';
import { EliminarRelacion } from '../../application/personas/EliminarRelacion';
import { RelacionInvalidaException } from '../../domain/exceptions/RelacionInvalidaException';

export class PersonasController {
  static listar(_req: Request, res: Response): void {
    const arbol = ArbolSingleton.obtenerInstancia();
    const personas = arbol.obtenerPersonas().map(p => p.toJSON());
    res.status(200).json({ data: personas });
  }

  static obtener(req: Request, res: Response): void {
    const arbol = ArbolSingleton.obtenerInstancia();
    const casoUso = new BuscarPersona(arbol);
    const persona = casoUso.ejecutar(req.params.id);
    if (!persona) {
      res.status(404).json({ error: 'Persona no encontrada' });
      return;
    }
    res.status(200).json({ data: persona.toJSON() });
  }

  static async crear(req: Request, res: Response): Promise<void> {
    try {
      const arbol = ArbolSingleton.obtenerInstancia();
      const repo = ArbolSingleton.obtenerRepositorio();
      const casoUso = new CrearPersona(arbol, repo);
      const persona = await casoUso.ejecutar(req.body);
      res.status(201).json({ data: persona.toJSON() });
    } catch (err) {
      res.status(500).json({ error: 'Error interno' });
    }
  }

  static async eliminar(req: Request, res: Response): Promise<void> {
    const arbol = ArbolSingleton.obtenerInstancia();
    const repo = ArbolSingleton.obtenerRepositorio();
    const casoUso = new EliminarPersona(arbol, repo);
    const eliminado = await casoUso.ejecutar(req.params.id);
    if (!eliminado) {
      res.status(404).json({ error: 'Persona no encontrada' });
      return;
    }
    res.status(200).json({ data: { eliminado: true } });
  }

  static obtenerFamilia(req: Request, res: Response): void {
    try {
      const arbol = ArbolSingleton.obtenerInstancia();
      const casoUso = new ObtenerFamilia(arbol);
      const familia = casoUso.ejecutar(req.params.id);
      res.status(200).json({ data: familia });
    } catch (err: any) {
      res.status(404).json({ error: err.message || 'Persona no encontrada' });
    }
  }

  static async crearRelacion(req: Request, res: Response): Promise<void> {
    try {
      const arbol = ArbolSingleton.obtenerInstancia();
      const repo = ArbolSingleton.obtenerRepositorio();
      const casoUso = new CrearRelacion(arbol, repo);
      const relacion = await casoUso.ejecutar(req.body);
      res.status(201).json({ data: relacion.toJSON() });
    } catch (err) {
      if (err instanceof RelacionInvalidaException) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(500).json({ error: 'Error interno al crear relación' });
    }
  }

  static async eliminarRelacion(req: Request, res: Response): Promise<void> {
    try {
      const arbol = ArbolSingleton.obtenerInstancia();
      const repo = ArbolSingleton.obtenerRepositorio();
      const casoUso = new EliminarRelacion(arbol, repo);
      const eliminado = await casoUso.ejecutar(req.params.relacionId);
      if (!eliminado) {
        res.status(404).json({ error: 'Relación no encontrada' });
        return;
      }
      res.status(200).json({ data: { eliminado: true } });
    } catch (err) {
      if (err instanceof RelacionInvalidaException) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(500).json({ error: 'Error interno al eliminar relación' });
    }
  }

  static buscar(req: Request, res: Response): void {
    const arbol = ArbolSingleton.obtenerInstancia();
    const query = req.query.q as string;
    if (!query) {
      res.status(400).json({ error: 'Parametro q requerido' });
      return;
    }
    const casoUso = new BuscarPersona(arbol);
    const personas = casoUso.ejecutarPorNombre(query).map(p => p.toJSON());
    res.status(200).json({ data: personas });
  }
}