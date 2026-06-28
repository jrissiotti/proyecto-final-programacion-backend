import { ArbolGenealogico } from '../../src/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/services/ValidadorCronologico';
import { ValidadorRelacion } from '../../src/services/ValidadorRelacion';
import { CrearPersona } from '../../src/applications/personas/CrearPersona';
import { CrearEvento } from '../../src/applications/eventos/CrearEvento';
import { EliminarEvento } from '../../src/applications/eventos/EliminarEvento';
import { EventoInvalidoException } from '../../src/exceptions/EventoInvalidoException';

describe('EliminarEvento', () => {
  let arbol: ArbolGenealogico;
  let crearPersona: CrearPersona;
  let crearEvento: CrearEvento;
  let eliminarEvento: EliminarEvento;

  beforeEach(() => {
    arbol = new ArbolGenealogico(new ValidadorCronologico(), new ValidadorRelacion());
    crearPersona = new CrearPersona(arbol);
    crearEvento = new CrearEvento(arbol);
    eliminarEvento = new EliminarEvento(arbol);
  });

  test('debe eliminar evento existente', () => {
    const persona = crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    const evento = crearEvento.ejecutar({
      personaId: persona.id,
      tipo: 'Nacimiento',
      fecha: new Date('1990-01-15'),
      descripcion: 'Nacimiento',
      ubicacion: { nombre: 'La Paz' }
    });
    
    const eliminado = eliminarEvento.ejecutar(persona.id, evento.id);
    expect(eliminado).toBe(true);
    expect(persona.obtenerEventos().length).toBe(0);
  });

  test('debe retornar false si evento no existe', () => {
    const persona = crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    const eliminado = eliminarEvento.ejecutar(persona.id, 'evento-inexistente');
    expect(eliminado).toBe(false);
  });

  test('debe lanzar excepcion si persona no existe', () => {
    expect(() => {
      eliminarEvento.ejecutar('999', 'evento-1');
    }).toThrow(EventoInvalidoException);
  });
});