import { ArbolGenealogico } from '../../src/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/services/ValidadorCronologico';
import { ValidadorRelacion } from '../../src/services/ValidadorRelacion';
import { CrearPersona } from '../../src/applications/personas/CrearPersona';
import { BuscarPersona } from '../../src/applications/personas/BuscarPersona';

describe('BuscarPersona', () => {
  let arbol: ArbolGenealogico;
  let crearPersona: CrearPersona;
  let buscarPersona: BuscarPersona;

  beforeEach(() => {
    arbol = new ArbolGenealogico(new ValidadorCronologico(), new ValidadorRelacion());
    crearPersona = new CrearPersona(arbol);
    buscarPersona = new BuscarPersona(arbol);
  });

  test('debe buscar persona por nombre', () => {
    crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    crearPersona.ejecutar({ nombre: 'Maria', apellido: 'Lopez', genero: 'F' });
    
    const resultados = buscarPersona.ejecutarPorNombre('Juan');
    expect(resultados.length).toBe(1);
    expect(resultados[0].nombre).toBe('Juan');
  });

  test('debe buscar persona por apellido', () => {
    crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    
    const resultados = buscarPersona.ejecutarPorNombre('Perez');
    expect(resultados.length).toBe(1);
  });

  test('debe retornar array vacio si no encuentra', () => {
    crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    
    const resultados = buscarPersona.ejecutarPorNombre('Pedro');
    expect(resultados.length).toBe(0);
  });

  test('debe buscar coincidencias parciales', () => {
    crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    crearPersona.ejecutar({ nombre: 'Juana', apellido: 'Gomez', genero: 'F' });
    
    const resultados = buscarPersona.ejecutarPorNombre('Juan');
    expect(resultados.length).toBe(2);
  });
});