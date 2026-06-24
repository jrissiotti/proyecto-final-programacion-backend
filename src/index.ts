import express from 'express';
import { setupSwagger } from './infrastructure/swagger/swagger.config';
import { corsMiddleware } from './infrastructure/middleware/corsMiddleware';
import { errorMiddleware } from './infrastructure/middleware/errorMiddleware';
import personasRoutes from './infrastructure/routes/personas.routes';
import eventosRoutes from './infrastructure/routes/eventos.routes';

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

app.listen(PORT, () => {
  console.log(`sge-core-api corriendo en http://localhost:${PORT}`);
  console.log(`Swagger UI en http://localhost:${PORT}/api-docs`);
});