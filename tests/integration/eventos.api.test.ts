// tests/integration/eventos.api.test.ts
import request from 'supertest';
import express from 'express';
import personasRoutes from '../../src/infrastructure/routes/personas.routes';
import eventosRoutes from '../../src/infrastructure/routes/eventos.routes';

const app = express();
app.use(express.json());
app.use('/api', personasRoutes);
app.use('/api', eventosRoutes);

describe('API Eventos - Integracion', () => {
  test('GET /api/personas/:id/eventos debe retornar eventos', async () => {
    const persona = await request(app)
      .post('/api')
      .send({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    
    const id = persona.body.data.id;
    const response = await request(app).get(`/api/personas/${id}/eventos`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('POST con fecha futura debe retornar error', async () => {
    const persona = await request(app)
      .post('/api')
      .send({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    
    const id = persona.body.data.id;
    const fechaFutura = new Date();
    fechaFutura.setFullYear(fechaFutura.getFullYear() + 1);
    
    const response = await request(app)
      .post(`/api/personas/${id}/eventos`)
      .send({
        tipo: 'Nacimiento',
        fecha: fechaFutura.toISOString(),
        descripcion: 'Nacimiento',
        ubicacion: { nombre: 'La Paz' }
      });
    
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('CRONOLOGIA');
  });

  test('GET /api/exportar/gedcom debe retornar string GEDCOM', async () => {
    const response = await request(app).get('/api/exportar/gedcom');
    
    expect(response.status).toBe(200);
    expect(typeof response.text).toBe('string');
    expect(response.text).toContain('HEAD');
    expect(response.text).toContain('TRLR');
  });
});