import { Persona } from '../domain/entities/Persona';
import { RelacionFamiliar } from '../domain/entities/RelacionFamiliar';
import { IValidadorCronologico } from '../domain/interfaces/IValidadorCronologico';
import { IValidadorRelacion } from '../domain/interfaces/IValidadorRelacion';
import { IExportador } from '../domain/interfaces/IExportador';
import { PilaHistorial } from '../generics/PilaHistorial';
import { Cambio, FamiliaDTO, PersonaDTO } from '../shared/types/arbol.types';

export class ArbolGenealogico {
  private _personas: Map<string, Persona>;
  private _relaciones: RelacionFamiliar[];
  private _historial: PilaHistorial<Cambio>;
  private _validadorCronologico: IValidadorCronologico;
  private _validadorRelacion: IValidadorRelacion;

  constructor(
    validadorCronologico: IValidadorCronologico,
    validadorRelacion: IValidadorRelacion,
    limiteHistorial: number = 100
  ) {
    this._personas = new Map();
    this._relaciones = [];
    this._historial = new PilaHistorial<Cambio>(limiteHistorial);
    this._validadorCronologico = validadorCronologico;
    this._validadorRelacion = validadorRelacion;
  }

  agregarPersona(persona: Persona): void {
    this._personas.set(persona.id, persona);
    this._historial.push({
      tipo: 'agregar_persona',
      entidadId: persona.id,
      timestamp: new Date()
    });
  }

  obtenerPersona(id: string): Persona | undefined {
    return this._personas.get(id);
  }

  obtenerPersonas(): readonly Persona[] {
    return Array.from(this._personas.values());
  }

  eliminarPersona(id: string): boolean {
    const persona = this._personas.get(id);
    if (!persona) return false;
    persona.limpiar();
    this._relaciones = this._relaciones.filter(
      r => r.personaOrigenId !== id && r.personaDestinoId !== id
    );
    this._personas.delete(id);
    this._historial.push({
      tipo: 'eliminar_persona',
      entidadId: id,
      timestamp: new Date()
    });
    return true;
  }

  agregarRelacion(relacion: RelacionFamiliar): void {
    this._validadorRelacion.validar(relacion, this);
    this._relaciones.push(relacion);
    this._historial.push({
      tipo: 'agregar_relacion',
      entidadId: relacion.id,
      timestamp: new Date()
    });
  }

  obtenerRelacionesDePersona(personaId: string): RelacionFamiliar[] {
    return this._relaciones.filter(
      r => r.personaOrigenId === personaId || r.personaDestinoId === personaId
    );
  }

  obtenerFamilia(personaId: string): FamiliaDTO {
    const persona = this._personas.get(personaId);
    if (!persona) {
      throw new Error('Persona no encontrada');
    }
    const relaciones = this.obtenerRelacionesDePersona(personaId);
    const padres: PersonaDTO[] = [];
    const conyuges: PersonaDTO[] = [];
    const hijos: PersonaDTO[] = [];

    for (const r of relaciones) {
      if (r.personaDestinoId === personaId) {
        if (r.tipo === 'PADRE_DE' || r.tipo === 'MADRE_DE') {
          const padre = this._personas.get(r.personaOrigenId);
          if (padre) padres.push(padre.toJSON() as PersonaDTO);
        }
      }
      if (r.personaOrigenId === personaId) {
        if (r.tipo === 'PADRE_DE' || r.tipo === 'MADRE_DE') {
          const hijo = this._personas.get(r.personaDestinoId);
          if (hijo) hijos.push(hijo.toJSON() as PersonaDTO);
        }
        if (r.tipo === 'CONYUGE_DE') {
          const conyuge = this._personas.get(r.personaDestinoId);
          if (conyuge) conyuges.push(conyuge.toJSON() as PersonaDTO);
        }
      }
      if (r.personaDestinoId === personaId && r.tipo === 'CONYUGE_DE') {
        const conyuge = this._personas.get(r.personaOrigenId);
        if (conyuge) conyuges.push(conyuge.toJSON() as PersonaDTO);
      }
    }

    return {
      persona: persona.toJSON() as PersonaDTO,
      padres,
      conyuges,
      hijos
    };
  }

  obtenerHistorial(): readonly Cambio[] {
    return this._historial.obtenerTodos();
  }

  exportarPersonas(exportador: IExportador<Persona>): string {
    return exportador.exportar(Array.from(this._personas.values()));
  }

  obtenerResumenMemoria(): { totalPersonas: number; totalRelaciones: number; referenciasActivas: number } {
    let referenciasActivas = 0;
    for (const persona of this._personas.values()) {
      referenciasActivas++;
      referenciasActivas += persona.obtenerEventos().length;
    }
    referenciasActivas += this._relaciones.length;
    return {
      totalPersonas: this._personas.size,
      totalRelaciones: this._relaciones.length,
      referenciasActivas
    };
  }
}