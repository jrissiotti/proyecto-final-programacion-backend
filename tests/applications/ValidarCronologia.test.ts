import { MockArbolRepository } from '../mocks/MockArbolRepository';
import { ArbolGenealogico } from '../../src/modules/arbol-genealogico/domain/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/modules/arbol-genealogico/domain/services/ValidadorCronologico';
import { ValidadorRelacion } from '../../src/modules/arbol-genealogico/domain/services/ValidadorRelacion';
import { ProcesadorArbol } from '../../src/modules/arbol-genealogico/domain/services/ProcesadorArbol';
import { ValidarCronologia } from '../../src/modules/arbol-genealogico/application/eventos/ValidarCronologia';

describe('ValidarCronologia', () => {
  let repo: MockArbolRepository;
  test('debe validar cronologia del arbol', async () => {
    const arbol = new ArbolGenealogico(new ValidadorCronologico(), new ValidadorRelacion());
    const procesador = new ProcesadorArbol();
    const validar = new ValidarCronologia(procesador, arbol);
    
    const resultado = await validar.ejecutar();
    
    expect(resultado).toHaveProperty('valido');
    expect(resultado).toHaveProperty('errores');
    expect(resultado).toHaveProperty('tiempoMs');
    expect(typeof resultado.valido).toBe('boolean');
    expect(Array.isArray(resultado.errores)).toBe(true);
    expect(typeof resultado.tiempoMs).toBe('number');
  });
});