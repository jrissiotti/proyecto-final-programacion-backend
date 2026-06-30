import { MockArbolRepository } from '../mocks/MockArbolRepository';
import { ArbolGenealogico } from '../../src/modules/arbol-genealogico/domain/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/modules/arbol-genealogico/domain/services/ValidadorCronologico';
import { ValidadorRelacion } from '../../src/modules/arbol-genealogico/domain/services/ValidadorRelacion';
import { CrearPersona } from '../../src/modules/arbol-genealogico/application/personas/CrearPersona';
import { BuscarPersona } from '../../src/modules/arbol-genealogico/application/personas/BuscarPersona';

describe('BuscarPersona', () => {
  let repo: MockArbolRepository;
  let arbol: ArbolGenealogico;
  let crearPersona: CrearPersona;
  let buscarPersona: BuscarPersona;

  beforeEach(() => {
    repo = new MockArbolRepository();
    arbol = new ArbolGenealogico(new ValidadorCronologico(), new ValidadorRelacion());
    crearPersona = new CrearPersona(arbol, repo);
    buscarPersona = new BuscarPersona(arbol);
  });

  test('debe buscar persona por nombre', async () => {
    await crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    await crearPersona.ejecutar({ nombre: 'Maria', apellido: 'Lopez', genero: 'F' });
    
    const resultados = buscarPersona.ejecutarPorNombre('Juan');
    expect(resultados.length).toBe(1);
    expect(resultados[0].nombre).toBe('Juan');
  });

  test('debe buscar persona por apellido', async () => {
    await crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    
    const resultados = buscarPersona.ejecutarPorNombre('Perez');
    expect(resultados.length).toBe(1);
  });

  test('debe retornar array vacio si no encuentra', async () => {
    await crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    
    const resultados = buscarPersona.ejecutarPorNombre('Pedro');
    expect(resultados.length).toBe(0);
  });

  test('debe buscar coincidencias parciales', async () => {
    await crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    await crearPersona.ejecutar({ nombre: 'Juana', apellido: 'Gomez', genero: 'F' });
    
    const resultados = buscarPersona.ejecutarPorNombre('Juan');
    expect(resultados.length).toBe(2);
  });
});