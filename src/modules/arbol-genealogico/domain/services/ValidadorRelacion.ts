import { IValidadorRelacion } from '../interfaces/IValidadorRelacion';
import { RelacionFamiliar } from '../entities/RelacionFamiliar';
import { ArbolGenealogico } from './ArbolGenealogico';
import { RelacionInvalidaException } from '../exceptions/RelacionInvalidaException';

export class ValidadorRelacion implements IValidadorRelacion {
  validar(relacion: RelacionFamiliar, arbol: ArbolGenealogico): boolean {
    const origen = arbol.obtenerPersona(relacion.personaOrigenId);
    const destino = arbol.obtenerPersona(relacion.personaDestinoId);

    if (!origen) {
      throw new RelacionInvalidaException(`Persona origen no existe: ${relacion.personaOrigenId}`);
    }
    if (!destino) {
      throw new RelacionInvalidaException(`Persona destino no existe: ${relacion.personaDestinoId}`);
    }

    if (relacion.personaOrigenId === relacion.personaDestinoId) {
      throw new RelacionInvalidaException('Una persona no puede tener relación consigo misma');
    }

    if (relacion.tipo === 'PADRE_DE' || relacion.tipo === 'MADRE_DE') {
      if (this._existeCiclo(relacion.personaDestinoId, relacion.personaOrigenId, arbol)) {
        throw new RelacionInvalidaException('La relación crearía un ciclo en el árbol genealógico');
      }
      const edadOrigen = origen.obtenerEdad();
      const edadDestino = destino.obtenerEdad();
      
      if (edadOrigen !== null && edadDestino !== null) {
        if (edadOrigen <= edadDestino) {
          throw new RelacionInvalidaException('El padre debe ser mayor que el hijo');
        }
        if (edadOrigen - edadDestino < 12) {
          throw new RelacionInvalidaException('La diferencia de edad padre-hijo debe ser al menos 12 años');
        }
      }
    }

    const existentes = arbol.obtenerRelacionesDePersona(relacion.personaOrigenId);
    const duplicada = existentes.find(r => 
      r.personaDestinoId === relacion.personaDestinoId && 
      r.tipo === relacion.tipo
    );
    if (duplicada) {
      throw new RelacionInvalidaException('Ya existe una relación idéntica');
    }

    return true;
  }

  private _existeCiclo(desdeId: string, buscandoId: string, arbol: ArbolGenealogico): boolean {
    if (desdeId === buscandoId) return true;

    const relaciones = arbol.obtenerRelacionesDePersona(desdeId);
    for (const r of relaciones) {
      if (r.personaDestinoId === desdeId && (r.tipo === 'PADRE_DE' || r.tipo === 'MADRE_DE')) {
        if (this._existeCiclo(r.personaOrigenId, buscandoId, arbol)) return true;
      }
    }
    return false;
  }
}