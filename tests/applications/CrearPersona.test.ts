import { MockArbolRepository } from '../mocks/MockArbolRepository';
import { ArbolGenealogico } from '../../src/modules/arbol-genealogico/domain/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/modules/arbol-genealogico/domain/services/ValidadorCronologico';
import { ValidadorRelacion } from '../../src/modules/arbol-genealogico/domain/services/ValidadorRelacion';
import { CrearPersona } from '../../src/modules/arbol-genealogico/application/personas/CrearPersona';

describe('CrearPersona', () => {
  let repo: MockArbolRepository;
  let arbol: ArbolGenealogico;
  let casoUso: CrearPersona;

  beforeEach(() => {
    repo = new MockArbolRepository();
    arbol = new ArbolGenealogico(new ValidadorCronologico(), new ValidadorRelacion());
    casoUso = new CrearPersona(arbol, repo);
  });

  test('debe crear persona y quedar en arbol', async () => {
    const persona = await casoUso.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    
    expect(persona.nombre).toBe('Juan');
    expect(persona.apellido).toBe('Perez');
    expect(persona.genero).toBe('M');
    expect(arbol.obtenerPersona(persona.id)).toBe(persona);
  });

  test('debe generar ID unico', async () => {
    const persona1 = await casoUso.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    const persona2 = await casoUso.ejecutar({ nombre: 'Maria', apellido: 'Lopez', genero: 'F' });
    
    expect(persona1.id).not.toBe(persona2.id);
  });
});