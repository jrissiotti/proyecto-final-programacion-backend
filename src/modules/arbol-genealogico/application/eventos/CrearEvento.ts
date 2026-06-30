import { ArbolGenealogico } from '../../domain/services/ArbolGenealogico';
import { EventoBase } from '../../domain/entities/EventoBase';
import { Nacimiento } from '../../domain/entities/Nacimiento';
import { Matrimonio } from '../../domain/entities/Matrimonio';
import { Defuncion } from '../../domain/entities/Defuncion';
import { Migracion } from '../../domain/entities/Migracion';
import { Ubicacion } from '../../domain/entities/Ubicacion';
import { TipoEvento } from '../../shared/types/arbol.types';
import { EventoInvalidoException } from '../../domain/exceptions/EventoInvalidoException';
import { IArbolRepository } from '../../domain/interfaces/IArbolRepository';
import { v4 as uuidv4 } from 'uuid';

export class CrearEvento {
  private _arbol: ArbolGenealogico;
  private _repositorio: IArbolRepository;

  constructor(arbol: ArbolGenealogico, repositorio: IArbolRepository) {
    this._arbol = arbol;
    this._repositorio = repositorio;
  }

  async ejecutar(datos: {
    personaId: string;
    tipo: TipoEvento;
    fecha: Date;
    descripcion: string;
    ubicacion: { nombre: string };
  }): Promise<EventoBase> {
    const persona = this._arbol.obtenerPersona(datos.personaId);
    if (!persona) {
      throw new EventoInvalidoException(`Persona no encontrada: ${datos.personaId}`);
    }

    const id = uuidv4();
    const ubicacion = new Ubicacion(datos.ubicacion.nombre);
    let evento: EventoBase;

    switch (datos.tipo) {
      case 'Nacimiento':
        evento = new Nacimiento(id, datos.personaId, datos.fecha, datos.descripcion, ubicacion);
        break;
      case 'Matrimonio':
        evento = new Matrimonio(id, datos.personaId, datos.fecha, datos.descripcion, ubicacion);
        break;
      case 'Defuncion':
        evento = new Defuncion(id, datos.personaId, datos.fecha, datos.descripcion, ubicacion);
        break;
      case 'Migracion':
        evento = new Migracion(id, datos.personaId, datos.fecha, datos.descripcion, ubicacion);
        break;
      default:
        throw new EventoInvalidoException(`Tipo de evento inválido: ${datos.tipo}`);
    }

    persona.agregarEvento(evento);
    await this._repositorio.guardarPersona(persona);
    return evento;
  }
}