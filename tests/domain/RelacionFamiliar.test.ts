import { RelacionFamiliar } from '../../src/modules/arbol-genealogico/domain/entities/RelacionFamiliar';
import { RelacionInvalidaException } from '../../src/modules/arbol-genealogico/domain/exceptions/RelacionInvalidaException';

describe('RelacionFamiliar', () => {
  test('debe crear relacion valida', () => {
    const relacion = new RelacionFamiliar('r1', '1', '2', 'PADRE_DE', new Date('2000-01-01'));
    
    expect(relacion.id).toBe('r1');
    expect(relacion.personaOrigenId).toBe('1');
    expect(relacion.personaDestinoId).toBe('2');
    expect(relacion.tipo).toBe('PADRE_DE');
    expect(relacion.esActiva()).toBe(true);
  });

  test('debe detectar relacion inactiva', () => {
    const fechaFin = new Date();
    fechaFin.setFullYear(fechaFin.getFullYear() - 1);
    
    const relacion = new RelacionFamiliar('r1', '1', '2', 'CONYUGE_DE', new Date('2000-01-01'), fechaFin);
    
    expect(relacion.esActiva()).toBe(false);
  });

  test('debe lanzar RelacionInvalidaException con tipo invalido', () => {
    expect(() => {
      // @ts-ignore
      new RelacionFamiliar('r1', '1', '2', 'INVALIDO');
    }).toThrow(RelacionInvalidaException);
  });

  test('debe generar JSON correcto', () => {
    const relacion = new RelacionFamiliar('r1', '1', '2', 'MADRE_DE', new Date('2000-01-01'));
    const json = relacion.toJSON() as any;
    
    expect(json.tipo).toBe('MADRE_DE');
    expect(json.activa).toBe(true);
  });

  test('debe detectar relacion activa con fecha fin en futuro', () => {
    const fechaFin = new Date();
    fechaFin.setFullYear(fechaFin.getFullYear() + 1);
    
    const relacion = new RelacionFamiliar('r1', '1', '2', 'CONYUGE_DE', new Date('2000-01-01'), fechaFin);
    expect(relacion.esActiva()).toBe(true);
  });
});