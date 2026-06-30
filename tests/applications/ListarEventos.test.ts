import { MockArbolRepository } from '../mocks/MockArbolRepository';
import { ArbolGenealogico } from '../../src/modules/arbol-genealogico/domain/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/modules/arbol-genealogico/domain/services/ValidadorCronologico';
import { ValidadorRelacion } from '../../src/modules/arbol-genealogico/domain/services/ValidadorRelacion';
import { CrearPersona } from '../../src/modules/arbol-genealogico/application/personas/CrearPersona';
import { CrearEvento } from '../../src/modules/arbol-genealogico/application/eventos/CrearEvento';
import { ListarEventos } from '../../src/modules/arbol-genealogico/application/eventos/ListarEventos';
import { EventoInvalidoException } from '../../src/modules/arbol-genealogico/domain/exceptions/EventoInvalidoException';

describe('ListarEventos', () => {
  let repo: MockArbolRepository;
  let arbol: ArbolGenealogico;
  let crearPersona: CrearPersona;
  let crearEvento: CrearEvento;
  let listarEventos: ListarEventos;

  beforeEach(() => {
    repo = new MockArbolRepository();
    arbol = new ArbolGenealogico(new ValidadorCronologico(), new ValidadorRelacion());
    crearPersona = new CrearPersona(arbol, repo);
    crearEvento = new CrearEvento(arbol, repo);
    listarEventos = new ListarEventos(arbol);
  });

  test('debe listar eventos de una persona', async () => {
    const persona = await crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    
    await crearEvento.ejecutar({
      personaId: persona.id,
      tipo: 'Nacimiento',
      fecha: new Date('1990-01-15'),
      descripcion: 'Nacimiento',
      ubicacion: { nombre: 'La Paz' }
    });
    
    const eventos = listarEventos.ejecutar(persona.id);
    expect(eventos.length).toBe(1);
  });

  test('debe retornar array vacio si no hay eventos', async () => {
    const persona = await crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    
    const eventos = listarEventos.ejecutar(persona.id);
    expect(eventos.length).toBe(0);
  });

  test('debe lanzar excepcion si persona no existe', async () => {
    expect(() => {
      listarEventos.ejecutar('999');
    }).toThrow(EventoInvalidoException);
  });
});