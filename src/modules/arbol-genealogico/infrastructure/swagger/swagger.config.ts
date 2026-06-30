import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SGE Core API',
      description: 'Sistema de Gestión E-Genealógico - API REST',
      version: '1.0.0',
      contact: {
        name: 'Desarrollador',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de desarrollo',
      },
    ],
    tags: [
      { name: 'Personas', description: 'Gestión de personas del árbol genealógico' },
      { name: 'Eventos', description: 'Eventos de vida (nacimiento, matrimonio, defunción, migración)' },
      { name: 'Validación', description: 'Validación de cronología y consistencia' },
      { name: 'Exportación', description: 'Exportación de datos en múltiples formatos' },
      { name: 'Historial', description: 'Historial de cambios del sistema' },
    ],
  },
  apis: ['./src/infrastructure/swagger/*.docs.ts'], // Archivos con anotaciones
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log('Swagger disponible en http://localhost:3000/api-docs');
}