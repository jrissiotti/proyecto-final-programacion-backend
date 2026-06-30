import { ArbolGenealogico } from '../../src/modules/arbol-genealogico/domain/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/modules/arbol-genealogico/domain/services/ValidadorCronologico';
import { ValidadorRelacion } from '../../src/modules/arbol-genealogico/domain/services/ValidadorRelacion';
import { Persona } from '../../src/modules/arbol-genealogico/domain/entities/Persona';
import { RelacionFamiliar } from '../../src/modules/arbol-genealogico/domain/entities/RelacionFamiliar';
import { Nacimiento } from '../../src/modules/arbol-genealogico/domain/entities/Nacimiento';
import { Ubicacion } from '../../src/modules/arbol-genealogico/domain/entities/Ubicacion';
import { ExportadorGEDCOM } from '../../src/modules/arbol-genealogico/infrastructure/exportadores/ExportadorGEDCOM';

describe('ArbolGenealogico', () => {
  let arbol: ArbolGenealogico;

  beforeEach(() => {
    arbol = new ArbolGenealogico(new ValidadorCronologico(), new ValidadorRelacion());
  });

  test('debe agregar persona', () => {
    const persona = new Persona('1', 'Juan', 'Perez', 'M');
    arbol.agregarPersona(persona);
    
    expect(arbol.obtenerPersona('1')).toBe(persona);
    expect(arbol.obtenerPersonas().length).toBe(1);
  });

  test('debe obtener persona por id', () => {
    const persona = new Persona('1', 'Juan', 'Perez', 'M');
    arbol.agregarPersona(persona);
    
    expect(arbol.obtenerPersona('1')).toBe(persona);
    expect(arbol.obtenerPersona('999')).toBeUndefined();
  });

  test('debe eliminar persona liberando referencias', () => {
    const persona = new Persona('1', 'Juan', 'Perez', 'M');
    const nacimiento = new Nacimiento('e1', '1', new Date('1990-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    persona.agregarEvento(nacimiento);
    
    arbol.agregarPersona(persona);
    
    const eliminado = arbol.eliminarPersona('1');
    expect(eliminado).toBe(true);
    expect(arbol.obtenerPersona('1')).toBeUndefined();
    expect(arbol.obtenerPersonas().length).toBe(0);
  });

  test('debe retornar false al eliminar persona inexistente', () => {
    expect(arbol.eliminarPersona('999')).toBe(false);
  });

  test('debe agregar relacion valida', () => {
    const padre = new Persona('1', 'Carlos', 'Perez', 'M');
    const hijo = new Persona('2', 'Juan', 'Perez', 'M');
    
    const nacPadre = new Nacimiento('e1', '1', new Date('1960-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    const nacHijo = new Nacimiento('e2', '2', new Date('1990-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    padre.agregarEvento(nacPadre);
    hijo.agregarEvento(nacHijo);
    
    arbol.agregarPersona(padre);
    arbol.agregarPersona(hijo);
    
    const relacion = new RelacionFamiliar('r1', '1', '2', 'PADRE_DE');
    arbol.agregarRelacion(relacion);
    
    expect(arbol.obtenerRelacionesDePersona('1').length).toBe(1);
  });

  test('debe obtener familia de persona', () => {
    const padre = new Persona('1', 'Carlos', 'Perez', 'M');
    const madre = new Persona('2', 'Maria', 'Lopez', 'F');
    const hijo = new Persona('3', 'Juan', 'Perez', 'M');
    
    const nacPadre = new Nacimiento('e1', '1', new Date('1960-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    const nacMadre = new Nacimiento('e2', '2', new Date('1962-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    const nacHijo = new Nacimiento('e3', '3', new Date('1990-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    
    padre.agregarEvento(nacPadre);
    madre.agregarEvento(nacMadre);
    hijo.agregarEvento(nacHijo);
    
    arbol.agregarPersona(padre);
    arbol.agregarPersona(madre);
    arbol.agregarPersona(hijo);
    
    arbol.agregarRelacion(new RelacionFamiliar('r1', '1', '3', 'PADRE_DE'));
    arbol.agregarRelacion(new RelacionFamiliar('r2', '2', '3', 'MADRE_DE'));
    arbol.agregarRelacion(new RelacionFamiliar('r3', '1', '2', 'CONYUGE_DE'));
    
    const familia = arbol.obtenerFamilia('3');
    expect(familia.padres.length).toBe(2);
    expect(familia.hijos.length).toBe(0);
  });

  test('debe exportar personas', () => {
    const persona = new Persona('1', 'Juan', 'Perez', 'M');
    arbol.agregarPersona(persona);
    
    const exportador = new ExportadorGEDCOM();
    const resultado = arbol.exportarPersonas(exportador);
    
    expect(resultado).toContain('Juan');
    expect(resultado).toContain('Perez');
  });

  test('debe obtener resumen de memoria', () => {
    const persona = new Persona('1', 'Juan', 'Perez', 'M');
    arbol.agregarPersona(persona);
    
    const resumen = arbol.obtenerResumenMemoria();
    expect(resumen.totalPersonas).toBe(1);
    expect(resumen.totalRelaciones).toBe(0);
    expect(resumen.referenciasActivas).toBe(1);
  });

  test('debe registrar historial de cambios', () => {
    const persona = new Persona('1', 'Juan', 'Perez', 'M');
    arbol.agregarPersona(persona);
    
    const historial = arbol.obtenerHistorial();
    expect(historial.length).toBe(1);
    expect(historial[0].tipo).toBe('agregar_persona');
    expect(historial[0].entidadId).toBe('1');
  });

  test('debe retornar false al eliminar persona inexistente', () => {
    expect(arbol.eliminarPersona('no-existe')).toBe(false);
  });

  test('debe obtener familia con conyuges desde origen', () => {
    const esposo = new Persona('10', 'Carlos', 'Perez', 'M');
    const esposa = new Persona('20', 'Maria', 'Lopez', 'F');
    
    arbol.agregarPersona(esposo);
    arbol.agregarPersona(esposa);

    arbol.agregarRelacion(new RelacionFamiliar('r1', '10', '20', 'CONYUGE_DE'));
    
    const familia = arbol.obtenerFamilia('10');
    expect(familia.conyuges.length).toBe(1);
    expect(familia.conyuges[0].nombre).toBe('Maria');
  });

  test('debe obtener familia con conyuges desde destino', () => {
    const esposo = new Persona('10', 'Carlos', 'Perez', 'M');
    const esposa = new Persona('20', 'Maria', 'Lopez', 'F');
    
    arbol.agregarPersona(esposo);
    arbol.agregarPersona(esposa);

    arbol.agregarRelacion(new RelacionFamiliar('r1', '20', '10', 'CONYUGE_DE'));
    
    const familia = arbol.obtenerFamilia('10');
    expect(familia.conyuges.length).toBe(1);
    expect(familia.conyuges[0].nombre).toBe('Maria');
  });
});