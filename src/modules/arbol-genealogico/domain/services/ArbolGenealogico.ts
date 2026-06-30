import { Persona } from '../entities/Persona';
import { RelacionFamiliar } from '../entities/RelacionFamiliar';
import { IValidadorCronologico } from '../interfaces/IValidadorCronologico';
import { IValidadorRelacion } from '../interfaces/IValidadorRelacion';
import { IExportador } from '../interfaces/IExportador';
import { PilaHistorial } from '../generics/PilaHistorial';
import { Cambio, FamiliaDTO, PersonaDTO } from '../../shared/types/arbol.types';

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

  eliminarRelacion(id: string): boolean {
    const longitudInicial = this._relaciones.length;
    this._relaciones = this._relaciones.filter(r => r.id !== id);
    
    if (this._relaciones.length < longitudInicial) {
      this._historial.push({
        tipo: 'eliminar_relacion',
        entidadId: id,
        timestamp: new Date()
      });
      return true;
    }
    return false;
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
          if (padre) {
            const dto = padre.toJSON() as PersonaDTO;
            dto.relacionId = r.id;
            padres.push(dto);
          }
        }
      }
      if (r.personaOrigenId === personaId) {
        if (r.tipo === 'PADRE_DE' || r.tipo === 'MADRE_DE') {
          const hijo = this._personas.get(r.personaDestinoId);
          if (hijo) {
            const dto = hijo.toJSON() as PersonaDTO;
            dto.relacionId = r.id;
            hijos.push(dto);
          }
        }
        if (r.tipo === 'CONYUGE_DE') {
          const conyuge = this._personas.get(r.personaDestinoId);
          if (conyuge) {
            const dto = conyuge.toJSON() as PersonaDTO;
            dto.relacionId = r.id;
            conyuges.push(dto);
          }
        }
      }
      if (r.personaDestinoId === personaId && r.tipo === 'CONYUGE_DE') {
        const conyuge = this._personas.get(r.personaOrigenId);
        if (conyuge) {
          const dto = conyuge.toJSON() as PersonaDTO;
          dto.relacionId = r.id;
          conyuges.push(dto);
        }
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

  cargarDatos(personas: Persona[], relaciones: RelacionFamiliar[], historial: Cambio[]): void {
    this._personas.clear();
    for (const p of personas) {
      this._personas.set(p.id, p);
    }
    this._relaciones = [...relaciones];
    this._historial.limpiar();
    for (const h of historial) {
      this._historial.push(h);
    }
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