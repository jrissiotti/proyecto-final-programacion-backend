import { Defuncion } from '../../src/modules/arbol-genealogico/domain/entities/Defuncion';
import { Ubicacion } from '../../src/modules/arbol-genealogico/domain/entities/Ubicacion';
import { FugaCronologicaException } from '../../src/modules/arbol-genealogico/domain/exceptions/FugaCronologicaException';

describe('Defuncion', () => {
  test('debe crear con datos validos', () => {
    const defuncion = new Defuncion('e1', '1', new Date('2020-01-15'), 'Defuncion en hospital', new Ubicacion('La Paz'));
    
    expect(defuncion.procesarImpacto()).toContain('Defunción registrada');
  });

  test('debe generar JSON correcto', () => {
    const defuncion = new Defuncion('e1', '1', new Date('2020-01-15'), 'Defuncion', new Ubicacion('La Paz'));
    const json = defuncion.toJSON() as any;
    
    expect(json.tipo).toBe('Defuncion');
    expect(json.impacto).toContain('fallecimiento');
  });

  test('debe lanzar FugaCronologicaException con fecha futura', () => {
    const fechaFutura = new Date();
    fechaFutura.setFullYear(fechaFutura.getFullYear() + 1);
    
    expect(() => {
      new Defuncion('e1', '1', fechaFutura, 'Defuncion', new Ubicacion('La Paz'));
    }).toThrow(FugaCronologicaException);
  });
});