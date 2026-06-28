import { ArbolGenealogico } from '../../src/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/services/ValidadorCronologico';
import { ValidadorRelacion } from '../../src/services/ValidadorRelacion';
import { CrearPersona } from '../../src/applications/personas/CrearPersona';
import { ObtenerFamilia } from '../../src/applications/personas/ObtenerFamilia';
import { Nacimiento } from '../../src/domain/entities/Nacimiento';
import { Ubicacion } from '../../src/domain/entities/Ubicacion';
import { RelacionFamiliar } from '../../src/domain/entities/RelacionFamiliar';

describe('ObtenerFamilia', () => {
  let arbol: ArbolGenealogico;
  let crearPersona: CrearPersona;
  let obtenerFamilia: ObtenerFamilia;

  beforeEach(() => {
    arbol = new ArbolGenealogico(new ValidadorCronologico(), new ValidadorRelacion());
    crearPersona = new CrearPersona(arbol);
    obtenerFamilia = new ObtenerFamilia(arbol);
  });

  test('debe obtener familia con padres e hijos', () => {
    const padre = crearPersona.ejecutar({ nombre: 'Carlos', apellido: 'Perez', genero: 'M' });
    const madre = crearPersona.ejecutar({ nombre: 'Maria', apellido: 'Lopez', genero: 'F' });
    const hijo = crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });

    // Agregar fechas de nacimiento para validación de edad
    const nacPadre = new Nacimiento('e1', padre.id, new Date('1960-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    const nacMadre = new Nacimiento('e2', madre.id, new Date('1962-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    const nacHijo = new Nacimiento('e3', hijo.id, new Date('1990-01-15'), 'Nacimiento', new Ubicacion('La Paz'));

    padre.agregarEvento(nacPadre);
    madre.agregarEvento(nacMadre);
    hijo.agregarEvento(nacHijo);

    arbol.agregarRelacion(new RelacionFamiliar('r1', padre.id, hijo.id, 'PADRE_DE'));
    arbol.agregarRelacion(new RelacionFamiliar('r2', madre.id, hijo.id, 'MADRE_DE'));
    arbol.agregarRelacion(new RelacionFamiliar('r3', padre.id, madre.id, 'CONYUGE_DE'));

    const familia = obtenerFamilia.ejecutar(hijo.id);
    expect(familia.padres.length).toBe(2);
    expect(familia.hijos.length).toBe(0);
    expect(familia.persona.nombre).toBe('Juan');
  });

  test('debe lanzar error si persona no existe', () => {
    expect(() => {
      obtenerFamilia.ejecutar('999');
    }).toThrow('Persona no encontrada');
  });
});