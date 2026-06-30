import { Persona } from '../entities/Persona';
import { RelacionFamiliar } from '../entities/RelacionFamiliar';
import { Cambio } from '../../shared/types/arbol.types';

export interface IArbolRepository {
  guardarPersona(persona: Persona): Promise<void>;
  obtenerPersona(id: string): Promise<Persona | undefined>;
  obtenerPersonas(): Promise<Persona[]>;
  eliminarPersona(id: string): Promise<boolean>;

  guardarRelacion(relacion: RelacionFamiliar): Promise<void>;
  obtenerRelaciones(): Promise<RelacionFamiliar[]>;
  eliminarRelacion(id: string): Promise<boolean>;

  guardarCambio(cambio: Cambio): Promise<void>;
  obtenerHistorial(): Promise<Cambio[]>;
}
