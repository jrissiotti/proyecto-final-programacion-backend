import { Ubicacion } from '../../src/modules/arbol-genealogico/domain/entities/Ubicacion';

describe('Ubicacion', () => {
  test('debe crear ubicacion con datos correctos', () => {
    const ubicacion = new Ubicacion('La Paz');
    
    expect(ubicacion.nombre).toBe('La Paz');
  });

  test('debe generar JSON correcto', () => {
    const ubicacion = new Ubicacion('Cochabamba');
    const json = ubicacion.toJSON() as any;
    
    expect(json.nombre).toBe('Cochabamba');
  });

  test('debe ser inmutable (no tiene setters)', () => {
    const ubicacion = new Ubicacion('Santa Cruz');
    
    // @ts-ignore
    expect(() => { ubicacion.nombre = 'Otro'; }).toThrow();
  });
});