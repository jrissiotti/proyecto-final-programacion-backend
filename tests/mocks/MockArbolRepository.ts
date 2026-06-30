import { IArbolRepository } from '../../src/modules/arbol-genealogico/domain/interfaces/IArbolRepository';
import { Persona } from '../../src/modules/arbol-genealogico/domain/entities/Persona';
import { RelacionFamiliar } from '../../src/modules/arbol-genealogico/domain/entities/RelacionFamiliar';
import { Cambio } from '../../src/modules/arbol-genealogico/shared/types/arbol.types';

export class MockArbolRepository implements IArbolRepository {
  personas: Persona[] = [];
  relaciones: RelacionFamiliar[] = [];
  historial: Cambio[] = [];

  async guardarPersona(persona: Persona): Promise<void> {
    const idx = this.personas.findIndex(p => p.id === persona.id);
    if (idx !== -1) this.personas[idx] = persona;
    else this.personas.push(persona);
  }
  async obtenerPersona(id: string): Promise<Persona | undefined> {
    return this.personas.find(p => p.id === id);
  }
  async obtenerPersonas(): Promise<Persona[]> {
    return this.personas;
  }
  async eliminarPersona(id: string): Promise<boolean> {
    const idx = this.personas.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.personas.splice(idx, 1);
    this.relaciones = this.relaciones.filter(r => r.personaOrigenId !== id && r.personaDestinoId !== id);
    return true;
  }
  async guardarRelacion(relacion: RelacionFamiliar): Promise<void> {
    const idx = this.relaciones.findIndex(r => r.id === relacion.id);
    if (idx !== -1) this.relaciones[idx] = relacion;
    else this.relaciones.push(relacion);
  }
  async obtenerRelaciones(): Promise<RelacionFamiliar[]> {
    return this.relaciones;
  }
  async eliminarRelacion(id: string): Promise<boolean> {
    const idx = this.relaciones.findIndex(r => r.id === id);
    if (idx === -1) return false;
    this.relaciones.splice(idx, 1);
    return true;
  }
  async guardarCambio(cambio: Cambio): Promise<void> {
    this.historial.push(cambio);
  }
  async obtenerHistorial(): Promise<Cambio[]> {
    return this.historial;
  }
}
