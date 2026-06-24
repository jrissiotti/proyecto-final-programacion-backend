import { IValidadorCronologico } from '../domain/interfaces/IValidadorCronologico';
import { EventoBase } from '../domain/entities/EventoBase';
import { Persona } from '../domain/entities/Persona';
import { Nacimiento } from '../domain/entities/Nacimiento';
import { Matrimonio } from '../domain/entities/Matrimonio';
import { Defuncion } from '../domain/entities/Defuncion';

export class ValidadorCronologico implements IValidadorCronologico {
  validar(evento: EventoBase): boolean {
    try {
      evento.validarCronologia();
      return true;
    } catch {
      return false;
    }
  }

  validarSecuencia(eventos: EventoBase[]): boolean {
    if (eventos.length <= 1) return true;
    
    const ordenados = [...eventos].sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
    
    for (let i = 1; i < ordenados.length; i++) {
      if (ordenados[i].fecha < ordenados[i - 1].fecha) {
        return false;
      }
    }
    return true;
  }

  validarPersona(persona: Persona): boolean {
    const eventos = persona.obtenerEventos();
    
    let fechaNacimiento: Date | null = null;
    let fechaMatrimonio: Date | null = null;
    let fechaDefuncion: Date | null = null;

    for (const evento of eventos) {
      if (evento instanceof Nacimiento) fechaNacimiento = evento.fecha;
      if (evento instanceof Matrimonio) fechaMatrimonio = evento.fecha;
      if (evento instanceof Defuncion) fechaDefuncion = evento.fecha;
    }

    // Nacimiento debe existir y ser antes de matrimonio
    if (fechaMatrimonio && fechaNacimiento) {
      if (fechaMatrimonio <= fechaNacimiento) return false;
    }

    // Matrimonio debe ser antes de defunción
    if (fechaDefuncion && fechaMatrimonio) {
      if (fechaDefuncion <= fechaMatrimonio) return false;
    }

    // Nacimiento debe ser antes de defunción
    if (fechaDefuncion && fechaNacimiento) {
      if (fechaDefuncion <= fechaNacimiento) return false;
    }

    return true;
  }
}