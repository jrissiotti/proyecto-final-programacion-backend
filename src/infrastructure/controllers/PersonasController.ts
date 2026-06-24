import { Request, Response } from 'express';
import { ArbolSingleton } from '../../services/ArbolSingleton';
import { CrearPersona } from '../../applications/personas/CrearPersona';
import { BuscarPersona } from '../../applications/personas/BuscarPersona';
import { ObtenerFamilia } from '../../applications/personas/ObtenerFamilia';
import { EliminarPersona } from '../../applications/personas/EliminarPersona';

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

  static crear(req: Request, res: Response): void {
    try {
      const arbol = ArbolSingleton.obtenerInstancia();
      const casoUso = new CrearPersona(arbol);
      const persona = casoUso.ejecutar(req.body);
      res.status(201).json({ data: persona.toJSON() });
    } catch (err) {
      res.status(500).json({ error: 'Error interno' });
    }
  }

  static eliminar(req: Request, res: Response): void {
    const arbol = ArbolSingleton.obtenerInstancia();
    const casoUso = new EliminarPersona(arbol);
    const eliminado = casoUso.ejecutar(req.params.id);
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