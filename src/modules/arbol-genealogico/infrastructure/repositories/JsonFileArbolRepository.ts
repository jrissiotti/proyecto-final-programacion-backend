import { IArbolRepository } from '../../domain/interfaces/IArbolRepository';
import { Persona } from '../../domain/entities/Persona';
import { RelacionFamiliar } from '../../domain/entities/RelacionFamiliar';
import { Ubicacion } from '../../domain/entities/Ubicacion';
import { EventoBase } from '../../domain/entities/EventoBase';
import { Nacimiento } from '../../domain/entities/Nacimiento';
import { Matrimonio } from '../../domain/entities/Matrimonio';
import { Defuncion } from '../../domain/entities/Defuncion';
import { Migracion } from '../../domain/entities/Migracion';
import { Cambio } from '../../shared/types/arbol.types';
import * as fs from 'fs/promises';
import * as path from 'path';

interface SchemaJSON {
  personas: any[];
  relaciones: any[];
  historial: any[];
}

export class JsonFileArbolRepository implements IArbolRepository {
  private _filePath: string;

  constructor(filePath?: string) {
    this._filePath = filePath || path.resolve(__dirname, '../../../../../../data/arbol.json');
  }

  private async _inicializarArchivo(): Promise<void> {
    const dir = path.dirname(this._filePath);
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch {}

    try {
      await fs.access(this._filePath);
    } catch {
      const dataInicial: SchemaJSON = { personas: [], relaciones: [], historial: [] };
      await fs.writeFile(this._filePath, JSON.stringify(dataInicial, null, 2), 'utf-8');
    }
  }

  private async _leerTodo(): Promise<SchemaJSON> {
    await this._inicializarArchivo();
    const contenido = await fs.readFile(this._filePath, 'utf-8');
    return JSON.parse(contenido);
  }

  private async _escribirTodo(data: SchemaJSON): Promise<void> {
    await this._inicializarArchivo();
    await fs.writeFile(this._filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async guardarPersona(persona: Persona): Promise<void> {
    const data = await this._leerTodo();
    const personaJSON = persona.toJSON() as any;
    
    const index = data.personas.findIndex(p => p.id === persona.id);
    if (index !== -1) {
      data.personas[index] = personaJSON;
    } else {
      data.personas.push(personaJSON);
    }
    await this._escribirTodo(data);
  }

  async obtenerPersona(id: string): Promise<Persona | undefined> {
    const personas = await this.obtenerPersonas();
    return personas.find(p => p.id === id);
  }

  async obtenerPersonas(): Promise<Persona[]> {
    const data = await this._leerTodo();
    const personas: Persona[] = [];

    for (const item of data.personas) {
      const p = new Persona(item.id, item.nombre, item.apellido, item.genero);
      
      if (item.eventos && Array.isArray(item.eventos)) {
        for (const e of item.eventos) {
          const ubicacion = new Ubicacion(e.ubicacion?.nombre || '');
          const fecha = new Date(e.fecha);
          let evento: EventoBase;

          switch (e.tipo) {
            case 'Nacimiento':
              evento = new Nacimiento(e.id, item.id, fecha, e.descripcion, ubicacion);
              break;
            case 'Matrimonio':
              evento = new Matrimonio(e.id, item.id, fecha, e.descripcion, ubicacion);
              break;
            case 'Defuncion':
              evento = new Defuncion(e.id, item.id, fecha, e.descripcion, ubicacion);
              break;
            case 'Migracion':
              evento = new Migracion(e.id, item.id, fecha, e.descripcion, ubicacion);
              break;
            default:
              continue;
          }
          p.agregarEvento(evento);
        }
      }
      personas.push(p);
    }
    return personas;
  }

  async eliminarPersona(id: string): Promise<boolean> {
    const data = await this._leerTodo();
    const index = data.personas.findIndex(p => p.id === id);
    if (index === -1) return false;

    data.personas.splice(index, 1);
    
    // Al eliminar una persona, también se eliminan sus relaciones familiares correspondientes
    data.relaciones = data.relaciones.filter(
      r => r.personaOrigenId !== id && r.personaDestinoId !== id
    );

    await this._escribirTodo(data);
    return true;
  }

  async guardarRelacion(relacion: RelacionFamiliar): Promise<void> {
    const data = await this._leerTodo();
    const relacionJSON = relacion.toJSON() as any;
    
    const index = data.relaciones.findIndex(r => r.id === relacion.id);
    if (index !== -1) {
      data.relaciones[index] = relacionJSON;
    } else {
      data.relaciones.push(relacionJSON);
    }
    await this._escribirTodo(data);
  }

  async obtenerRelaciones(): Promise<RelacionFamiliar[]> {
    const data = await this._leerTodo();
    return data.relaciones.map(r => {
      return new RelacionFamiliar(
        r.id,
        r.personaOrigenId,
        r.personaDestinoId,
        r.tipo,
        r.fechaInicio ? new Date(r.fechaInicio) : null,
        r.fechaFin ? new Date(r.fechaFin) : null
      );
    });
  }

  async eliminarRelacion(id: string): Promise<boolean> {
    const data = await this._leerTodo();
    const index = data.relaciones.findIndex(r => r.id === id);
    if (index === -1) return false;

    data.relaciones.splice(index, 1);
    await this._escribirTodo(data);
    return true;
  }

  async guardarCambio(cambio: Cambio): Promise<void> {
    const data = await this._leerTodo();
    data.historial.push({
      tipo: cambio.tipo,
      entidadId: cambio.entidadId,
      timestamp: cambio.timestamp.toISOString()
    });
    await this._escribirTodo(data);
  }

  async obtenerHistorial(): Promise<Cambio[]> {
    const data = await this._leerTodo();
    return data.historial.map(h => ({
      tipo: h.tipo,
      entidadId: h.entidadId,
      timestamp: new Date(h.timestamp)
    }));
  }
}
