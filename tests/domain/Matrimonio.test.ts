import { Matrimonio } from '../../src/domain/entities/Matrimonio';
import { Ubicacion } from '../../src/domain/entities/Ubicacion';
import { FugaCronologicaException } from '../../src/exceptions/FugaCronologicaException';

describe('Matrimonio', () => {
  test('debe crear con datos validos', () => {
    const matrimonio = new Matrimonio('e1', '1', new Date('2015-06-20'), 'Matrimonio civil', new Ubicacion('Cochabamba'));
    
    expect(matrimonio.procesarImpacto()).toContain('Matrimonio registrado');
  });

  test('debe generar JSON correcto', () => {
    const matrimonio = new Matrimonio('e1', '1', new Date('2015-06-20'), 'Matrimonio', new Ubicacion('Cochabamba'));
    const json = matrimonio.toJSON() as any;
    
    expect(json.tipo).toBe('Matrimonio');
    expect(json.impacto).toContain('vínculo matrimonial');
  });

  test('debe lanzar FugaCronologicaException con fecha futura', () => {
    const fechaFutura = new Date();
    fechaFutura.setFullYear(fechaFutura.getFullYear() + 1);
    
    expect(() => {
      new Matrimonio('e1', '1', fechaFutura, 'Matrimonio', new Ubicacion('Cochabamba'));
    }).toThrow(FugaCronologicaException);
  });
});