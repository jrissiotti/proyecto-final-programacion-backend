import { ArbolSingleton } from '../src/modules/arbol-genealogico/domain/services/ArbolSingleton';
import { MockArbolRepository } from './mocks/MockArbolRepository';

process.env.NODE_ENV = 'test';

beforeEach(async () => {
  ArbolSingleton.reiniciar();
  await ArbolSingleton.inicializar(new MockArbolRepository());
});