import { Nacimiento } from '../../src/domain/entities/Nacimiento';
import { Ubicacion } from '../../src/domain/entities/Ubicacion';
import { FugaCronologicaException } from '../../src/exceptions/FugaCronologicaException';

describe('Nacimiento', () => {
  test('debe crear con datos validos', () => {
    const nacimiento = new Nacimiento('e1', '1', new Date('1990-01-15'), 'Nacimiento en hospital', new Ubicacion('La Paz'));
    
    expect(nacimiento.id).toBe('e1');
    expect(nacimiento.procesarImpacto()).toContain('Nacimiento registrado');
  });

  test('debe generar JSON correcto', () => {
    const nacimiento = new Nacimiento('e1', '1', new Date('1990-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    const json = nacimiento.toJSON() as any;
    
    expect(json.tipo).toBe('Nacimiento');
    expect(json.impacto).toContain('Nacimiento registrado');
    expect(json.ubicacion.nombre).toBe('La Paz');
  });

  test('debe lanzar FugaCronologicaException con fecha futura', () => {
    const fechaFutura = new Date();
    fechaFutura.setFullYear(fechaFutura.getFullYear() + 1);
    
    expect(() => {
      new Nacimiento('e1', '1', fechaFutura, 'Nacimiento', new Ubicacion('La Paz'));
    }).toThrow(FugaCronologicaException);
  });
});