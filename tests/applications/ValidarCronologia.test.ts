import { ArbolGenealogico } from '../../src/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/services/ValidadorCronologico';
import { ValidadorRelacion } from '../../src/services/ValidadorRelacion';
import { ProcesadorArbol } from '../../src/services/ProcesadorArbol';
import { ValidarCronologia } from '../../src/applications/eventos/ValidarCronologia';

describe('ValidarCronologia', () => {
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