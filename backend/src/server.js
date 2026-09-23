import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

try {
  await connectDatabase();
  app.listen(env.PORT, () => {
    console.log(`ERP API escuchando en http://localhost:${env.PORT}`);
  });
} catch (error) {
  console.error('No fue posible iniciar el backend:', error.message);
  process.exit(1);
}
