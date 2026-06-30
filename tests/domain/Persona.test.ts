import { Persona } from '../../src/modules/arbol-genealogico/domain/entities/Persona';
import { Nacimiento } from '../../src/modules/arbol-genealogico/domain/entities/Nacimiento';
import { Defuncion } from '../../src/modules/arbol-genealogico/domain/entities/Defuncion';
import { Matrimonio } from '../../src/modules/arbol-genealogico/domain/entities/Matrimonio';
import { Migracion } from '../../src/modules/arbol-genealogico/domain/entities/Migracion';
import { Ubicacion } from '../../src/modules/arbol-genealogico/domain/entities/Ubicacion';

describe('Persona', () => {
  let persona: Persona;

  beforeEach(() => {
    persona = new Persona('1', 'Juan', 'Perez', 'M');
  });

  test('debe crear persona con datos correctos', () => {
    expect(persona.id).toBe('1');
    expect(persona.nombre).toBe('Juan');
    expect(persona.apellido).toBe('Perez');
    expect(persona.genero).toBe('M');
    expect(persona.estaViva()).toBe(true);
    expect(persona.obtenerEdad()).toBeNull();
  });

  test('debe agregar evento y ordenar cronologicamente', () => {
    const nacimiento = new Nacimiento('e1', '1', new Date('1990-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    const matrimonio = new Matrimonio('e2', '1', new Date('2015-06-20'), 'Matrimonio', new Ubicacion('Cochabamba'));
    
    persona.agregarEvento(matrimonio);
    persona.agregarEvento(nacimiento);
    
    const eventos = persona.obtenerEventos();
    expect(eventos.length).toBe(2);
    expect(eventos[0].id).toBe('e1');
    expect(eventos[1].id).toBe('e2');
  });

  test('debe eliminar evento liberando referencias', () => {
    const nacimiento = new Nacimiento('e1', '1', new Date('1990-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    persona.agregarEvento(nacimiento);
    
    const eliminado = persona.eliminarEvento('e1');
    expect(eliminado).toBe(true);
    expect(persona.obtenerEventos().length).toBe(0);
    expect(persona.fechaNacimiento).toBeNull();
  });

  test('debe obtener eventos por tipo', () => {
    const nacimiento = new Nacimiento('e1', '1', new Date('1990-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    const defuncion = new Defuncion('e2', '1', new Date('2020-01-15'), 'Defuncion', new Ubicacion('La Paz'));
    
    persona.agregarEvento(nacimiento);
    persona.agregarEvento(defuncion);
    
    expect(persona.obtenerEventosPorTipo('Nacimiento').length).toBe(1);
    expect(persona.obtenerEventosPorTipo('Defuncion').length).toBe(1);
    expect(persona.obtenerEventosPorTipo('Matrimonio').length).toBe(0);
  });

  test('debe calcular edad correctamente', () => {
    const fechaNac = new Date();
    fechaNac.setFullYear(fechaNac.getFullYear() - 25);
    const nacimiento = new Nacimiento('e1', '1', fechaNac, 'Nacimiento', new Ubicacion('La Paz'));
    persona.agregarEvento(nacimiento);
    
    expect(persona.obtenerEdad()).toBe(25);
    expect(persona.estaViva()).toBe(true);
  });

  test('debe detectar persona fallecida', () => {
    const nacimiento = new Nacimiento('e1', '1', new Date('1990-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    const defuncion = new Defuncion('e2', '1', new Date('2020-01-15'), 'Defuncion', new Ubicacion('La Paz'));
    
    persona.agregarEvento(nacimiento);
    persona.agregarEvento(defuncion);
    
    expect(persona.estaViva()).toBe(false);
    expect(persona.obtenerEdad()).toBe(30);
  });

  test('debe actualizar nombre y apellido', () => {
    persona.nombre = 'Pedro';
    persona.apellido = 'Gomez';
    expect(persona.nombre).toBe('Pedro');
    expect(persona.apellido).toBe('Gomez');
  });

  test('debe retornar false al eliminar evento inexistente', () => {
    const persona = new Persona('99', 'Test', 'Test', 'M');
    expect(persona.eliminarEvento('no-existe')).toBe(false);
  });

  test('debe recalcular fechas cuando no quedan eventos', () => {
    const persona = new Persona('99', 'Test', 'Test', 'M');
    const nac = new Nacimiento('e1', '99', new Date('1990-01-15'), 'Nac', new Ubicacion('LP'));
    
    persona.agregarEvento(nac);
    expect(persona.fechaNacimiento).not.toBeNull();
    
    persona.eliminarEvento('e1');
    expect(persona.fechaNacimiento).toBeNull();
    expect(persona.obtenerEdad()).toBeNull();
  });

  test('obtenerEventosPorTipo debe retornar vacio para tipo inexistente', () => {
    const persona = new Persona('99', 'Test', 'Test', 'M');
    const nac = new Nacimiento('e1', '99', new Date('1990-01-15'), 'Nac', new Ubicacion('LP'));
    persona.agregarEvento(nac);
    
    expect(persona.obtenerEventosPorTipo('Inexistente').length).toBe(0);
  });

  test('toJSON debe tener edad null sin fecha nacimiento', () => {
    const persona = new Persona('99', 'Test', 'Test', 'M');
    const json = persona.toJSON() as any;
    expect(json.edad).toBeNull();
    expect(json.fechaNacimiento).toBeNull();
  });

    test('debe actualizar nombre y apellido con setters', () => {
    const persona = new Persona('99', 'Juan', 'Perez', 'M');
    persona.nombre = 'Pedro';
    persona.apellido = 'Gomez';
    expect(persona.nombre).toBe('Pedro');
    expect(persona.apellido).toBe('Gomez');
  });

  test('debe recalcular fechas sin eventos de nacimiento ni defuncion', () => {
    const persona = new Persona('99', 'Test', 'Test', 'M');
    const mat = new Matrimonio('e1', '99', new Date('2015-06-20'), 'Mat', new Ubicacion('LP'));
    
    persona.agregarEvento(mat);
    expect(persona.fechaNacimiento).toBeNull();
    
    persona.eliminarEvento('e1');
    expect(persona.fechaNacimiento).toBeNull();
    expect(persona.fechaDefuncion).toBeNull();
  });

  test('toJSON con persona sin eventos debe tener edad null', () => {
    const persona = new Persona('99', 'Sin', 'Eventos', 'M');
    const json = persona.toJSON() as any;
    expect(json.edad).toBeNull();
    expect(json.fechaNacimiento).toBeNull();
    expect(json.fechaDefuncion).toBeNull();
    expect(json.estaViva).toBe(true);
  });
});