import { ArbolGenealogico } from '../../src/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/services/ValidadorCronologico';
import { ValidadorRelacion } from '../../src/services/ValidadorRelacion';
import { CrearPersona } from '../../src/applications/personas/CrearPersona';
import { CrearEvento } from '../../src/applications/eventos/CrearEvento';
import { ListarEventos } from '../../src/applications/eventos/ListarEventos';
import { EventoInvalidoException } from '../../src/exceptions/EventoInvalidoException';

describe('ListarEventos', () => {
  let arbol: ArbolGenealogico;
  let crearPersona: CrearPersona;
  let crearEvento: CrearEvento;
  let listarEventos: ListarEventos;

  beforeEach(() => {
    arbol = new ArbolGenealogico(new ValidadorCronologico(), new ValidadorRelacion());
    crearPersona = new CrearPersona(arbol);
    crearEvento = new CrearEvento(arbol);
    listarEventos = new ListarEventos(arbol);
  });

  test('debe listar eventos de una persona', () => {
    const persona = crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    
    crearEvento.ejecutar({
      personaId: persona.id,
      tipo: 'Nacimiento',
      fecha: new Date('1990-01-15'),
      descripcion: 'Nacimiento',
      ubicacion: { nombre: 'La Paz' }
    });
    
    const eventos = listarEventos.ejecutar(persona.id);
    expect(eventos.length).toBe(1);
  });

  test('debe retornar array vacio si no hay eventos', () => {
    const persona = crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    
    const eventos = listarEventos.ejecutar(persona.id);
    expect(eventos.length).toBe(0);
  });

  test('debe lanzar excepcion si persona no existe', () => {
    expect(() => {
      listarEventos.ejecutar('999');
    }).toThrow(EventoInvalidoException);
  });
});