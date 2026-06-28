import { ProcesadorArbol } from '../../src/services/ProcesadorArbol';
import { ArbolGenealogico } from '../../src/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/services/ValidadorCronologico';
import { ValidadorRelacion } from '../../src/services/ValidadorRelacion';
import { Persona } from '../../src/domain/entities/Persona';
import { Nacimiento } from '../../src/domain/entities/Nacimiento';
import { Ubicacion } from '../../src/domain/entities/Ubicacion';
import { RelacionFamiliar } from '../../src/domain/entities/RelacionFamiliar';

describe('ProcesadorArbol', () => {
  let arbol: ArbolGenealogico;
  let procesador: ProcesadorArbol;

  beforeEach(() => {
    arbol = new ArbolGenealogico(new ValidadorCronologico(), new ValidadorRelacion());
    procesador = new ProcesadorArbol();
  });

  test('debe validar consistencia con arbol vacio', async () => {
    const resultado = await procesador.validarConsistencia(arbol);
    expect(resultado).toHaveProperty('valido');
    expect(resultado).toHaveProperty('errores');
    expect(resultado).toHaveProperty('tiempoMs');
    expect(resultado.valido).toBe(true);
  });

  test('debe validar consistencia con arbol valido', async () => {
    const padre = new Persona('1', 'Carlos', 'Perez', 'M');
    const hijo = new Persona('2', 'Juan', 'Perez', 'M');

    const nacPadre = new Nacimiento('e1', '1', new Date('1960-01-15'), 'Nac', new Ubicacion('LP'));
    const nacHijo = new Nacimiento('e2', '2', new Date('1990-01-15'), 'Nac', new Ubicacion('LP'));

    padre.agregarEvento(nacPadre);
    hijo.agregarEvento(nacHijo);

    arbol.agregarPersona(padre);
    arbol.agregarPersona(hijo);
    arbol.agregarRelacion(new RelacionFamiliar('r1', '1', '2', 'PADRE_DE'));

    const resultado = await procesador.validarConsistencia(arbol);
    expect(resultado.valido).toBe(true);
    expect(resultado.errores.length).toBe(0);
  });
});