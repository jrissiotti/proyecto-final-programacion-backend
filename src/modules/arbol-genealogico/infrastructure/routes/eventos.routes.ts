import { Router } from 'express';
import { EventosController } from '../controllers/EventosController';

const router = Router();

router.get('/personas/:personaId/eventos', EventosController.listar);
router.post('/personas/:personaId/eventos', EventosController.crear);
router.put('/personas/:personaId/eventos/:eventoId', EventosController.actualizar);
router.delete('/personas/:personaId/eventos/:eventoId', EventosController.eliminar);

router.get('/exportar/gedcom', EventosController.exportarGEDCOM);
router.get('/exportar/:formato', EventosController.exportar);

router.get('/historial', EventosController.historial);

export default router;