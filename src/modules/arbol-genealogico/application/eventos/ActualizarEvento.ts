import { ArbolGenealogico } from '../../domain/services/ArbolGenealogico';
import { EventoBase } from '../../domain/entities/EventoBase';
import { Ubicacion } from '../../domain/entities/Ubicacion';
import { TipoEvento } from '../../shared/types/arbol.types';
import { EventoInvalidoException } from '../../domain/exceptions/EventoInvalidoException';
import { IArbolRepository } from '../../domain/interfaces/IArbolRepository';

export class ActualizarEvento {
  private _arbol: ArbolGenealogico;
  private _repositorio: IArbolRepository;

  constructor(arbol: ArbolGenealogico, repositorio: IArbolRepository) {
    this._arbol = arbol;
    this._repositorio = repositorio;
  }

  async ejecutar(datos: {
    personaId: string;
    eventoId: string;
    tipo: TipoEvento;
    fecha: Date;
    descripcion: string;
    ubicacion: { nombre: string };
  }): Promise<EventoBase> {
    const persona = this._arbol.obtenerPersona(datos.personaId);
    if (!persona) {
      throw new EventoInvalidoException(`Persona no encontrada: ${datos.personaId}`);
    }

    const ubicacion = new Ubicacion(datos.ubicacion.nombre);
    
    try {
      const eventoActualizado = persona.actualizarEvento(datos.eventoId, {
        tipo: datos.tipo,
        fecha: datos.fecha,
        descripcion: datos.descripcion,
        ubicacion: ubicacion
      });
      await this._repositorio.guardarPersona(persona);
      return eventoActualizado;
    } catch (err: any) {
      throw new EventoInvalidoException(err.message || 'Error al actualizar el evento');
    }
  }
}
