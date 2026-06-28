import { ValidadorCronologico } from '../../src/services/ValidadorCronologico';
import { Persona } from '../../src/domain/entities/Persona';
import { Nacimiento } from '../../src/domain/entities/Nacimiento';
import { Matrimonio } from '../../src/domain/entities/Matrimonio';
import { Defuncion } from '../../src/domain/entities/Defuncion';
import { Ubicacion } from '../../src/domain/entities/Ubicacion';

describe('ValidadorCronologico', () => {
  let validador: ValidadorCronologico;

  beforeEach(() => {
    validador = new ValidadorCronologico();
  });

  test('debe validar evento valido', () => {
    const nacimiento = new Nacimiento('e1', '1', new Date('1990-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    expect(validador.validar(nacimiento)).toBe(true);
  });

  test('debe validar evento invalido', () => {
    const fechaFutura = new Date();
    fechaFutura.setFullYear(fechaFutura.getFullYear() + 1);
    
    expect(() => {
      new Nacimiento('e1', '1', fechaFutura, 'Nacimiento', new Ubicacion('La Paz'));
    }).toThrow();
  });

  test('debe validar secuencia ordenada', () => {
    const evento1 = new Nacimiento('e1', '1', new Date('1990-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    const evento2 = new Matrimonio('e2', '1', new Date('2015-06-20'), 'Matrimonio', new Ubicacion('La Paz'));
    
    expect(validador.validarSecuencia([evento1, evento2])).toBe(true);
  });

  test('debe validar secuencia ordenada cronologicamente aunque venga desordenada', () => {
    const evento1 = new Nacimiento('e1', '1', new Date('2015-06-20'), 'Nacimiento', new Ubicacion('La Paz'));
    const evento2 = new Matrimonio('e2', '1', new Date('1990-01-15'), 'Matrimonio', new Ubicacion('La Paz'));
    
    expect(validador.validarSecuencia([evento1, evento2])).toBe(true);
  });

  test('debe validar persona con eventos coherentes', () => {
    const persona = new Persona('1', 'Juan', 'Perez', 'M');
    const nacimiento = new Nacimiento('e1', '1', new Date('1990-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    const matrimonio = new Matrimonio('e2', '1', new Date('2015-06-20'), 'Matrimonio', new Ubicacion('La Paz'));
    const defuncion = new Defuncion('e3', '1', new Date('2020-01-15'), 'Defuncion', new Ubicacion('La Paz'));
    
    persona.agregarEvento(nacimiento);
    persona.agregarEvento(matrimonio);
    persona.agregarEvento(defuncion);
    
    expect(validador.validarPersona(persona)).toBe(true);
  });

  test('debe invalidar persona con eventos incoherentes', () => {
    const persona = new Persona('1', 'Juan', 'Perez', 'M');
    const nacimiento = new Nacimiento('e1', '1', new Date('2015-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    const matrimonio = new Matrimonio('e2', '1', new Date('1990-06-20'), 'Matrimonio', new Ubicacion('La Paz'));
    
    persona.agregarEvento(nacimiento);
    persona.agregarEvento(matrimonio);
    
    expect(validador.validarPersona(persona)).toBe(false);
  });

  test('debe validar evento invalido sin lanzar excepcion', () => {
    const eventoMock = {
      validarCronologia: () => { throw new Error('Fecha futura'); }
    } as any;
    
    expect(validador.validar(eventoMock)).toBe(false);
  });

  test('debe validar secuencia vacia', () => {
    expect(validador.validarSecuencia([])).toBe(true);
  });

  test('debe validar secuencia con un solo evento', () => {
    const evento = new Nacimiento('e1', '1', new Date('1990-01-15'), 'Nac', new Ubicacion('LP'));
    expect(validador.validarSecuencia([evento])).toBe(true);
  });
});