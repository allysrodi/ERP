import { Router } from 'express';
import { getDatabaseStatus } from '../config/database.js';

const healthRouter = Router();

healthRouter.get('/', (request, response) => {
  response.status(200).json({
    success: true,
    data: {
      service: 'erp-backend',
      status: 'ok',
      database: getDatabaseStatus(),
      timestamp: new Date().toISOString()
    },
    message: 'API disponible'
  });
});

healthRouter.get('/ready', (request, response) => {
  const database = getDatabaseStatus();
  const ready = database.configured && database.connected;

  response.status(ready ? 200 : 503).json({
    success: ready,
    data: { service: 'erp-backend', status: ready ? 'ready' : 'not_ready', database },
    message: ready ? 'API lista para recibir trafico' : 'Dependencias no disponibles'
  });
});

export default healthRouter;
