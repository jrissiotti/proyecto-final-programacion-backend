import { v4 as uuidv4 } from 'uuid';

export function generarUUID(): string {
  return uuidv4();
}

export function formatearFecha(fecha: Date | null): string | null {
  if (!fecha) return null;
  return fecha.toISOString();
}

export function calcularEdad(fechaNacimiento: Date, fechaReferencia: Date = new Date()): number {
  let edad = fechaReferencia.getFullYear() - fechaNacimiento.getFullYear();
  const mes = fechaReferencia.getMonth() - fechaNacimiento.getMonth();
  
  if (mes < 0 || (mes === 0 && fechaReferencia.getDate() < fechaNacimiento.getDate())) {
    edad--;
  }
  
  return edad;
}

export function normalizarTexto(texto: string): string {
  return texto.toLowerCase().trim();
}

export function logger(mensaje: string, nivel: 'info' | 'warn' | 'error' = 'info'): void {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${nivel.toUpperCase()}]`;
  
  if (nivel === 'error') {
    console.error(`${prefix} ${mensaje}`);
  } else if (nivel === 'warn') {
    console.warn(`${prefix} ${mensaje}`);
  } else {
    console.log(`${prefix} ${mensaje}`);
  }
}