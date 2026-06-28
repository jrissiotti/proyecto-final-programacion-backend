import { EventoBase } from '../../src/domain/entities/EventoBase';
import { Nacimiento } from '../../src/domain/entities/Nacimiento';
import { Ubicacion } from '../../src/domain/entities/Ubicacion';

describe('EventoBase', () => {
  test('debe ser una clase abstracta', () => {
    const nacimiento = new Nacimiento('e1', '1', new Date('1990-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    expect(typeof nacimiento.procesarImpacto).toBe('function');
    expect(typeof nacimiento.toJSON).toBe('function');
    expect(typeof nacimiento.validarCronologia).toBe('function');
    expect(nacimiento.procesarImpacto()).toContain('Nacimiento');
  });

  test('debe permitir modificar descripcion', () => {
    const nacimiento = new Nacimiento('e1', '1', new Date('1990-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    expect(nacimiento.descripcion).toBe('Nacimiento');
    nacimiento.descripcion = 'Nacimiento modificado';
    expect(nacimiento.descripcion).toBe('Nacimiento modificado');
  });

  test('debe lanzar FugaCronologicaException con fecha futura', () => {
    const fechaFutura = new Date();
    fechaFutura.setFullYear(fechaFutura.getFullYear() + 1);
    expect(() => {
      new Nacimiento('e1', '1', fechaFutura, 'Nacimiento', new Ubicacion('La Paz'));
    }).toThrow();
  });

  test('debe validar cronologia en constructor', () => {
    const fechaPasada = new Date('1990-01-15');
    const nacimiento = new Nacimiento('e1', '1', fechaPasada, 'Nacimiento', new Ubicacion('La Paz'));
    expect(nacimiento.fecha).toEqual(fechaPasada);
  });
});