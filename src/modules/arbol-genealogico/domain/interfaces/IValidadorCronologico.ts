import { EventoBase } from '../entities/EventoBase';
import { Persona } from '../entities/Persona';

export interface IValidadorCronologico {
  validar(evento: EventoBase): boolean;
  validarSecuencia(eventos: EventoBase[]): boolean;
  validarPersona(persona: Persona): boolean;
}