import database from './db.js';
import { startCronJobs } from './open-data-cron.script.js';
import app from './app.js';

const PORT = process.env.PORT || 3000;

startCronJobs();

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}: http://localhost:${PORT}`);
});
