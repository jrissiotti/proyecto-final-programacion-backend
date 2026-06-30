import { IValidadorCronologico } from '../interfaces/IValidadorCronologico';
import { EventoBase } from '../entities/EventoBase';
import { Persona } from '../entities/Persona';
import { Nacimiento } from '../entities/Nacimiento';
import { Matrimonio } from '../entities/Matrimonio';
import { Defuncion } from '../entities/Defuncion';

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

    if (fechaMatrimonio && fechaNacimiento) {
      if (fechaMatrimonio <= fechaNacimiento) return false;
    }

    if (fechaDefuncion && fechaMatrimonio) {
      if (fechaDefuncion <= fechaMatrimonio) return false;
    }

    if (fechaDefuncion && fechaNacimiento) {
      if (fechaDefuncion <= fechaNacimiento) return false;
    }

    return true;
  }
}