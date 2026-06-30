import { MockArbolRepository } from '../mocks/MockArbolRepository';
import { ArbolGenealogico } from '../../src/modules/arbol-genealogico/domain/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/modules/arbol-genealogico/domain/services/ValidadorCronologico';
import { ValidadorRelacion } from '../../src/modules/arbol-genealogico/domain/services/ValidadorRelacion';
import { CrearPersona } from '../../src/modules/arbol-genealogico/application/personas/CrearPersona';
import { CrearRelacion } from '../../src/modules/arbol-genealogico/application/personas/CrearRelacion';
import { RelacionInvalidaException } from '../../src/modules/arbol-genealogico/domain/exceptions/RelacionInvalidaException';

describe('CrearRelacion', () => {
  let repo: MockArbolRepository;
  let arbol: ArbolGenealogico;
  let crearPersona: CrearPersona;
  let casoUso: CrearRelacion;

  beforeEach(() => {
    repo = new MockArbolRepository();
    arbol = new ArbolGenealogico(new ValidadorCronologico(), new ValidadorRelacion());
    crearPersona = new CrearPersona(arbol, repo);
    casoUso = new CrearRelacion(arbol, repo);
  });

  test('debe crear relacion familiar valida', async () => {
    const p1 = await crearPersona.ejecutar({ nombre: 'Padre', apellido: 'Perez', genero: 'M' });
    const p2 = await crearPersona.ejecutar({ nombre: 'Hijo', apellido: 'Perez', genero: 'M' });

    const relacion = await casoUso.ejecutar({
      personaOrigenId: p1.id,
      personaDestinoId: p2.id,
      tipo: 'PADRE_DE'
    });

    expect(relacion).toBeDefined();
    expect(relacion.personaOrigenId).toBe(p1.id);
    expect(relacion.personaDestinoId).toBe(p2.id);
    expect(relacion.tipo).toBe('PADRE_DE');
  });

  test('debe lanzar excepcion si faltan datos requeridos', async () => {
    await expect(casoUso.ejecutar({
      personaOrigenId: '',
      personaDestinoId: '123',
      tipo: 'PADRE_DE'
    })).rejects.toThrow(RelacionInvalidaException);
  });

  test('debe lanzar excepcion si la relacion no es valida logicamente', async () => {
    const p1 = await crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });

    // Intenta crear relación consigo mismo
    await expect(casoUso.ejecutar({
      personaOrigenId: p1.id,
      personaDestinoId: p1.id,
      tipo: 'PADRE_DE'
    })).rejects.toThrow(RelacionInvalidaException);
  });
});
