import { ArbolGenealogico } from '../../src/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/services/ValidadorCronologico';
import { ValidadorRelacion } from '../../src/services/ValidadorRelacion';
import { CrearPersona } from '../../src/applications/personas/CrearPersona';

describe('CrearPersona', () => {
  let arbol: ArbolGenealogico;
  let casoUso: CrearPersona;

  beforeEach(() => {
    arbol = new ArbolGenealogico(new ValidadorCronologico(), new ValidadorRelacion());
    casoUso = new CrearPersona(arbol);
  });

  test('debe crear persona y quedar en arbol', () => {
    const persona = casoUso.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    
    expect(persona.nombre).toBe('Juan');
    expect(persona.apellido).toBe('Perez');
    expect(persona.genero).toBe('M');
    expect(arbol.obtenerPersona(persona.id)).toBe(persona);
  });

  test('debe generar ID unico', () => {
    const persona1 = casoUso.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    const persona2 = casoUso.ejecutar({ nombre: 'Maria', apellido: 'Lopez', genero: 'F' });
    
    expect(persona1.id).not.toBe(persona2.id);
  });
});