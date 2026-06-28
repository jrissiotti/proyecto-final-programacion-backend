// tests/integration/personas.api.test.ts
import request from 'supertest';
import express from 'express';
import personasRoutes from '../../src/infrastructure/routes/personas.routes';

const app = express();
app.use(express.json());
app.use('/api', personasRoutes);

describe('API Personas - Integracion', () => {
  test('GET /api debe retornar array', async () => {
    const response = await request(app).get('/api');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('POST /api debe crear persona', async () => {
    const response = await request(app)
      .post('/api')
      .send({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    
    expect(response.status).toBe(201);
    expect(response.body.data.nombre).toBe('Juan');
    expect(response.body.data.apellido).toBe('Perez');
    expect(response.body.data.genero).toBe('M');
    expect(response.body.data.id).toBeDefined();
  });

  test('GET /api/:id debe retornar persona', async () => {
    const crear = await request(app)
      .post('/api')
      .send({ nombre: 'Maria', apellido: 'Lopez', genero: 'F' });
    
    const id = crear.body.data.id;
    const response = await request(app).get(`/api/${id}`);
    
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(id);
  });

  test('DELETE /api/:id debe eliminar persona', async () => {
    const crear = await request(app)
      .post('/api')
      .send({ nombre: 'Pedro', apellido: 'Gomez', genero: 'M' });
    
    const id = crear.body.data.id;
    const response = await request(app).delete(`/api/${id}`);
    
    expect(response.status).toBe(200);
    expect(response.body.data.eliminado).toBe(true);
  });
});