import { ValidadorRelacion } from '../../src/services/ValidadorRelacion';
import { ArbolGenealogico } from '../../src/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/services/ValidadorCronologico';
import { Persona } from '../../src/domain/entities/Persona';
import { RelacionFamiliar } from '../../src/domain/entities/RelacionFamiliar';
import { Nacimiento } from '../../src/domain/entities/Nacimiento';
import { Ubicacion } from '../../src/domain/entities/Ubicacion';
import { RelacionInvalidaException } from '../../src/exceptions/RelacionInvalidaException';

describe('ValidadorRelacion', () => {
  let arbol: ArbolGenealogico;
  let validador: ValidadorRelacion;

  beforeEach(() => {
    arbol = new ArbolGenealogico(new ValidadorCronologico(), new ValidadorRelacion());
    validador = new ValidadorRelacion();
  });

  test('debe validar relacion valida', () => {
    const padre = new Persona('1', 'Carlos', 'Perez', 'M');
    const hijo = new Persona('2', 'Juan', 'Perez', 'M');
    
    const nacPadre = new Nacimiento('e1', '1', new Date('1960-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    const nacHijo = new Nacimiento('e2', '2', new Date('1990-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    padre.agregarEvento(nacPadre);
    hijo.agregarEvento(nacHijo);
    
    arbol.agregarPersona(padre);
    arbol.agregarPersona(hijo);
    
    const relacion = new RelacionFamiliar('r1', '1', '2', 'PADRE_DE');
    expect(validador.validar(relacion, arbol)).toBe(true);
  });

  test('debe invalidar relacion con ciclo', () => {
    const persona1 = new Persona('1', 'Carlos', 'Perez', 'M');
    const persona2 = new Persona('2', 'Juan', 'Perez', 'M');
    const persona3 = new Persona('3', 'Pedro', 'Perez', 'M');
    
    const nac1 = new Nacimiento('e1', '1', new Date('1940-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    const nac2 = new Nacimiento('e2', '2', new Date('1960-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    const nac3 = new Nacimiento('e3', '3', new Date('1980-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    
    persona1.agregarEvento(nac1);
    persona2.agregarEvento(nac2);
    persona3.agregarEvento(nac3);
    
    arbol.agregarPersona(persona1);
    arbol.agregarPersona(persona2);
    arbol.agregarPersona(persona3);

    arbol.agregarRelacion(new RelacionFamiliar('r1', '1', '2', 'PADRE_DE'));
    arbol.agregarRelacion(new RelacionFamiliar('r2', '2', '3', 'PADRE_DE'));

    const relacionCiclo = new RelacionFamiliar('r3', '3', '1', 'PADRE_DE');
    expect(() => validador.validar(relacionCiclo, arbol)).toThrow(RelacionInvalidaException);
  });

  test('debe invalidar relacion con persona inexistente', () => {
    const persona = new Persona('1', 'Juan', 'Perez', 'M');
    arbol.agregarPersona(persona);
    
    const relacion = new RelacionFamiliar('r1', '1', '999', 'PADRE_DE');
    expect(() => validador.validar(relacion, arbol)).toThrow(RelacionInvalidaException);
  });

  test('debe invalidar relacion padre-hijo con diferencia de edad invalida', () => {
    const padre = new Persona('1', 'Carlos', 'Perez', 'M');
    const hijo = new Persona('2', 'Juan', 'Perez', 'M');

    const nacPadre = new Nacimiento('e1', '1', new Date('1985-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    const nacHijo = new Nacimiento('e2', '2', new Date('1990-01-15'), 'Nacimiento', new Ubicacion('La Paz'));
    padre.agregarEvento(nacPadre);
    hijo.agregarEvento(nacHijo);
    
    arbol.agregarPersona(padre);
    arbol.agregarPersona(hijo);
    
    const relacion = new RelacionFamiliar('r1', '1', '2', 'PADRE_DE');
    expect(() => validador.validar(relacion, arbol)).toThrow(RelacionInvalidaException);
  });

  test('debe invalidar cuando persona origen no existe', () => {
    const relacion = new RelacionFamiliar('r1', '999', '1', 'PADRE_DE');
    expect(() => validador.validar(relacion, arbol)).toThrow(RelacionInvalidaException);
  });

  test('debe invalidar relacion consigo mismo', () => {
    const persona = new Persona('1', 'Juan', 'Perez', 'M');
    arbol.agregarPersona(persona);
    
    const relacion = new RelacionFamiliar('r1', '1', '1', 'PADRE_DE');
    expect(() => validador.validar(relacion, arbol)).toThrow(RelacionInvalidaException);
  });

  test('debe invalidar cuando padre no es mayor que hijo', () => {
    const padre = new Persona('1', 'Carlos', 'Perez', 'M');
    const hijo = new Persona('2', 'Juan', 'Perez', 'M');

    const nacPadre = new Nacimiento('e1', '1', new Date('1990-01-15'), 'Nac', new Ubicacion('LP'));
    const nacHijo = new Nacimiento('e2', '2', new Date('1990-01-15'), 'Nac', new Ubicacion('LP'));
    
    padre.agregarEvento(nacPadre);
    hijo.agregarEvento(nacHijo);
    
    arbol.agregarPersona(padre);
    arbol.agregarPersona(hijo);
    
    const relacion = new RelacionFamiliar('r1', '1', '2', 'PADRE_DE');
    expect(() => validador.validar(relacion, arbol)).toThrow(RelacionInvalidaException);
  });

  test('debe invalidar relacion duplicada', () => {
    const padre = new Persona('1', 'Carlos', 'Perez', 'M');
    const hijo = new Persona('2', 'Juan', 'Perez', 'M');
    
    const nacPadre = new Nacimiento('e1', '1', new Date('1960-01-15'), 'Nac', new Ubicacion('LP'));
    const nacHijo = new Nacimiento('e2', '2', new Date('1990-01-15'), 'Nac', new Ubicacion('LP'));
    
    padre.agregarEvento(nacPadre);
    hijo.agregarEvento(nacHijo);
    
    arbol.agregarPersona(padre);
    arbol.agregarPersona(hijo);
    
    arbol.agregarRelacion(new RelacionFamiliar('r1', '1', '2', 'PADRE_DE'));
    
    const duplicada = new RelacionFamiliar('r2', '1', '2', 'PADRE_DE');
    expect(() => validador.validar(duplicada, arbol)).toThrow(RelacionInvalidaException);
  });
});