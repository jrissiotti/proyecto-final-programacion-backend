export type TipoEvento = 'Nacimiento' | 'Matrimonio' | 'Defuncion' | 'Migracion';

export type TipoRelacion = 'PADRE_DE' | 'MADRE_DE' | 'CONYUGE_DE';

export type Genero = 'M' | 'F';

export interface Cambio {
  tipo: 'agregar_persona' | 'eliminar_persona' | 'agregar_evento' | 'eliminar_evento' | 'agregar_relacion';
  entidadId: string;
  timestamp: Date;
}

export interface PersonaDTO {
  id: string;
  nombre: string;
  apellido: string;
  genero: Genero;
  eventos: object[];
  fechaNacimiento: string | null;
  fechaDefuncion: string | null;
  edad: number | null;
  estaViva: boolean;
}

export interface FamiliaDTO {
  persona: PersonaDTO;
  padres: PersonaDTO[];
  conyuges: PersonaDTO[];
  hijos: PersonaDTO[];
}