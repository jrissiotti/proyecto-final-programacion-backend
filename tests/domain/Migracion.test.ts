import { Migracion } from '../../src/domain/entities/Migracion';
import { Ubicacion } from '../../src/domain/entities/Ubicacion';
import { FugaCronologicaException } from '../../src/exceptions/FugaCronologicaException';

describe('Migracion', () => {
  test('debe crear con datos validos', () => {
    const migracion = new Migracion('e1', '1', new Date('2010-03-10'), 'Mudanza por trabajo', new Ubicacion('Santa Cruz'));
    
    expect(migracion.procesarImpacto()).toContain('Migración registrada');
  });

  test('debe generar JSON correcto', () => {
    const migracion = new Migracion('e1', '1', new Date('2010-03-10'), 'Migracion', new Ubicacion('Santa Cruz'));
    const json = migracion.toJSON() as any;
    
    expect(json.tipo).toBe('Migracion');
    expect(json.impacto).toContain('Santa Cruz');
  });

  test('debe lanzar FugaCronologicaException con fecha futura', () => {
    const fechaFutura = new Date();
    fechaFutura.setFullYear(fechaFutura.getFullYear() + 1);
    
    expect(() => {
      new Migracion('e1', '1', fechaFutura, 'Migracion', new Ubicacion('Santa Cruz'));
    }).toThrow(FugaCronologicaException);
  });
});