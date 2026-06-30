import { MockArbolRepository } from '../mocks/MockArbolRepository';
import { ArbolGenealogico } from '../../src/modules/arbol-genealogico/domain/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/modules/arbol-genealogico/domain/services/ValidadorCronologico';
import { ValidadorRelacion } from '../../src/modules/arbol-genealogico/domain/services/ValidadorRelacion';
import { Persona } from '../../src/modules/arbol-genealogico/domain/entities/Persona';
import { Nacimiento } from '../../src/modules/arbol-genealogico/domain/entities/Nacimiento';
import { Ubicacion } from '../../src/modules/arbol-genealogico/domain/entities/Ubicacion';
import { RelacionFamiliar } from '../../src/modules/arbol-genealogico/domain/entities/RelacionFamiliar';
import { ExportadorGEDCOM } from '../../src/modules/arbol-genealogico/infrastructure/exportadores/ExportadorGEDCOM';
import { CrearPersona } from '../../src/modules/arbol-genealogico/application/personas/CrearPersona';
import { EliminarPersona } from '../../src/modules/arbol-genealogico/application/personas/EliminarPersona';

describe('EliminarPersona', () => {
  let repo: MockArbolRepository;
  let arbol: ArbolGenealogico;
  let crearPersona: CrearPersona;
  let eliminarPersona: EliminarPersona;

  beforeEach(() => {
    repo = new MockArbolRepository();
    arbol = new ArbolGenealogico(new ValidadorCronologico(), new ValidadorRelacion());
    crearPersona = new CrearPersona(arbol, repo);
    eliminarPersona = new EliminarPersona(arbol, repo);
  });

  test('debe eliminar persona existente', async () => {
    const persona = await crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    const eliminado = await eliminarPersona.ejecutar(persona.id);
    expect(eliminado).toBe(true);
    expect(arbol.obtenerPersona(persona.id)).toBeUndefined();
  });

  test('debe retornar false si persona no existe', async () => {
    const eliminado = await eliminarPersona.ejecutar('999');
    expect(eliminado).toBe(false);
  });
});