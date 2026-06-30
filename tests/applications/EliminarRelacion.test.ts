import { MockArbolRepository } from '../mocks/MockArbolRepository';
import { ArbolGenealogico } from '../../src/modules/arbol-genealogico/domain/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/modules/arbol-genealogico/domain/services/ValidadorCronologico';
import { ValidadorRelacion } from '../../src/modules/arbol-genealogico/domain/services/ValidadorRelacion';
import { CrearPersona } from '../../src/modules/arbol-genealogico/application/personas/CrearPersona';
import { CrearRelacion } from '../../src/modules/arbol-genealogico/application/personas/CrearRelacion';
import { EliminarRelacion } from '../../src/modules/arbol-genealogico/application/personas/EliminarRelacion';
import { RelacionInvalidaException } from '../../src/modules/arbol-genealogico/domain/exceptions/RelacionInvalidaException';

describe('EliminarRelacion', () => {
  let repo: MockArbolRepository;
  let arbol: ArbolGenealogico;
  let crearPersona: CrearPersona;
  let crearRelacion: CrearRelacion;
  let casoUso: EliminarRelacion;

  beforeEach(() => {
    repo = new MockArbolRepository();
    arbol = new ArbolGenealogico(new ValidadorCronologico(), new ValidadorRelacion());
    crearPersona = new CrearPersona(arbol, repo);
    crearRelacion = new CrearRelacion(arbol, repo);
    casoUso = new EliminarRelacion(arbol, repo);
  });

  test('debe eliminar relacion existente', async () => {
    const p1 = await crearPersona.ejecutar({ nombre: 'Padre', apellido: 'Gomez', genero: 'M' });
    const p2 = await crearPersona.ejecutar({ nombre: 'Hijo', apellido: 'Gomez', genero: 'M' });
    const relacion = await crearRelacion.ejecutar({
      personaOrigenId: p1.id,
      personaDestinoId: p2.id,
      tipo: 'PADRE_DE'
    });

    await casoUso.ejecutar(relacion.id);
    // After deletion, attempting to delete again should return false
    await expect(casoUso.ejecutar(relacion.id)).resolves.toBe(false);
  });

  test('debe lanzar excepcion si id es vacio', async () => {
    await expect(casoUso.ejecutar('')).rejects.toThrow(RelacionInvalidaException);
  });
});
