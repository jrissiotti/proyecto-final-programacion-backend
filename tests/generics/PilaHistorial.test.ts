import { PilaHistorial } from '../../src/generics/PilaHistorial';

describe('PilaHistorial', () => {
  test('debe lanzar error con limite 0', () => {
    expect(() => new PilaHistorial(0)).toThrow('El límite debe ser mayor a 0');
  });

  test('debe lanzar error con limite negativo', () => {
    expect(() => new PilaHistorial(-1)).toThrow('El límite debe ser mayor a 0');
  });

  test('debe hacer push dentro del limite', () => {
    const pila = new PilaHistorial<number>(3);
    pila.push(1);
    pila.push(2);
    
    expect(pila.tamano()).toBe(2);
    expect(pila.peek()).toBe(2);
  });

  test('debe eliminar el mas antiguo al exceder limite', () => {
    const pila = new PilaHistorial<number>(3);
    pila.push(1);
    pila.push(2);
    pila.push(3);
    pila.push(4);
    
    expect(pila.tamano()).toBe(3);
    expect(pila.obtenerTodos()).toEqual([2, 3, 4]);
  });

  test('debe hacer pop correctamente', () => {
    const pila = new PilaHistorial<string>(3);
    pila.push('a');
    pila.push('b');
    
    expect(pila.pop()).toBe('b');
    expect(pila.tamano()).toBe(1);
  });

  test('debe retornar undefined con pop en pila vacia', () => {
    const pila = new PilaHistorial<number>(3);
    expect(pila.pop()).toBeUndefined();
  });

  test('peek debe retornar undefined en pila vacia', () => {
    const pila = new PilaHistorial<number>(3);
    expect(pila.peek()).toBeUndefined();
  });

  test('peek debe retornar ultimo sin eliminar', () => {
    const pila = new PilaHistorial<number>(3);
    pila.push(1);
    pila.push(2);
    
    expect(pila.peek()).toBe(2);
    expect(pila.tamano()).toBe(2);
  });

  test('obtenerTodos debe retornar copia inmutable', () => {
    const pila = new PilaHistorial<number>(3);
    pila.push(1);
    pila.push(2);
    
    const todos = pila.obtenerTodos();
    expect(todos).toEqual([1, 2]);
    
    (todos as number[]).push(3);
    expect(pila.tamano()).toBe(2);
  });

  test('estaVacia debe funcionar correctamente', () => {
    const pila = new PilaHistorial<number>(3);
    expect(pila.estaVacia()).toBe(true);
    
    pila.push(1);
    expect(pila.estaVacia()).toBe(false);
  });

  test('limpiar debe vaciar la pila', () => {
    const pila = new PilaHistorial<number>(3);
    pila.push(1);
    pila.push(2);
    pila.limpiar();
    
    expect(pila.estaVacia()).toBe(true);
    expect(pila.tamano()).toBe(0);
  });
});