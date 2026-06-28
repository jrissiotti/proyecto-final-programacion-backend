import { ArbolGenealogico } from '../../src/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/services/ValidadorCronologico';
import { ValidadorRelacion } from '../../src/services/ValidadorRelacion';
import { Persona } from '../../src/domain/entities/Persona';
import { Nacimiento } from '../../src/domain/entities/Nacimiento';
import { Ubicacion } from '../../src/domain/entities/Ubicacion';
import { RelacionFamiliar } from '../../src/domain/entities/RelacionFamiliar';
import { ExportadorGEDCOM } from '../../src/infrastructure/exportadores/ExportadorGEDCOM';
import { CrearPersona } from '../../src/applications/personas/CrearPersona';
import { EliminarPersona } from '../../src/applications/personas/EliminarPersona';

describe('EliminarPersona', () => {
  let arbol: ArbolGenealogico;
  let crearPersona: CrearPersona;
  let eliminarPersona: EliminarPersona;

  beforeEach(() => {
    arbol = new ArbolGenealogico(new ValidadorCronologico(), new ValidadorRelacion());
    crearPersona = new CrearPersona(arbol);
    eliminarPersona = new EliminarPersona(arbol);
  });

  test('debe eliminar persona existente', () => {
    const persona = crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    const eliminado = eliminarPersona.ejecutar(persona.id);
    expect(eliminado).toBe(true);
    expect(arbol.obtenerPersona(persona.id)).toBeUndefined();
  });

  test('debe retornar false si persona no existe', () => {
    const eliminado = eliminarPersona.ejecutar('999');
    expect(eliminado).toBe(false);
  });
});