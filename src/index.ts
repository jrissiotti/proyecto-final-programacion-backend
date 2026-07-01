import express from 'express';
import { setupSwagger } from './modules/arbol-genealogico/infrastructure/swagger/swagger.config';
import { corsMiddleware } from './modules/arbol-genealogico/infrastructure/middleware/corsMiddleware';
import { errorMiddleware } from './modules/arbol-genealogico/infrastructure/middleware/errorMiddleware';
import personasRoutes from './modules/arbol-genealogico/infrastructure/routes/personas.routes';
import eventosRoutes from './modules/arbol-genealogico/infrastructure/routes/eventos.routes';
import { ArbolSingleton } from './modules/arbol-genealogico/domain/services/ArbolSingleton';
import { JsonFileArbolRepository } from './modules/arbol-genealogico/infrastructure/repositories/JsonFileArbolRepository';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(corsMiddleware);
setupSwagger(app);
app.use('/api/personas', personasRoutes);
app.use('/api', eventosRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorMiddleware);

async function startServer() {
  try {
    // Inicializar el singleton con el repositorio JSON
    await ArbolSingleton.inicializar(new JsonFileArbolRepository());
    
  try {
    app.listen(PORT, () => {
      console.log(`sge-core-api corriendo en http://localhost:${PORT}`);
      console.log(`Swagger UI en http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    if ((err as any).code === 'EADDRINUSE') {
      const fallbackPort = 3001;
      app.listen(fallbackPort, () => {
        console.log(`Port 3000 in use, server started on fallback port ${fallbackPort}`);
        console.log(`Swagger UI en http://localhost:${fallbackPort}/api-docs`);
      });
    } else {
      throw err;
    }
  }
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  }
}

startServer();