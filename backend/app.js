// Dependencias
import express from 'express';
import cors from 'cors';
import expressMongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';

// Custom
import errorHandler from './middlewares/errors/error-handler.middleware.js';

// Routers de los componentes
import authRouter from './components/auth/index.js';
import boxRouter from './components/box/index.js';
import boxInnerMaterialRouter from './components/box-inner-material/index.js';
import boxOuterMaterialRouter from './components/box-outer-material/index.js';
import boxDetailMaterialRouter from './components/box-detail-material/index.js';
import cutRouter from './components/cuts/cut.router.js';
import sizeRouter from './components/sizes/index.js';
import employeesRouter from './components/employees/index.js';
import gemstonesRouter from './components/gemstones/index.js';
import jewelsRouter from './components/jewels/index.js';
import materialsRouter from './components/materials/index.js';
import ordersRouter from './components/orders/index.js';
import statsRouter from './components/stats/index.js';
import usersRouter from './components/users/index.js';
import settingsRouter from './components/settings/index.js';
import baseStructuresRouter from './components/baseStructures/index.js';
import healthRouter from './components/health/health.routes.js';
import eventsRouter from './components/events/index.js';
import { eventSchema } from './components/events/events.validators.js';
// Declaraciones
const app = express();
const whitelist = process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim());

// Options para Cors
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
};

// Lo que se va a sanear en las peticiones.
const mongoSanitize = (req, res, next) => {
    const options = { allowDots: true };

    expressMongoSanitize.sanitize(req.query, options);
    expressMongoSanitize.sanitize(req.body, options);
    expressMongoSanitize.sanitize(req.params, options);

    next();
};

// Middlewares globales
app.use(express.json());
app.use(cors(corsOptions));
app.use(mongoSanitize);
app.use(cookieParser());

eventSchema.safeParse({});
const apiRouter = express.Router();

// Prefijo individual a cada router específico.
apiRouter.use('/auth', authRouter);
apiRouter.use('/box', boxRouter);
apiRouter.use('/innerMaterials', boxInnerMaterialRouter);
apiRouter.use('/outerMaterials', boxOuterMaterialRouter);
apiRouter.use('/detailMaterials', boxDetailMaterialRouter);
apiRouter.use('/cuts', cutRouter);
apiRouter.use('/sizes', sizeRouter);
apiRouter.use('/employees', employeesRouter);
apiRouter.use('/gemstones', gemstonesRouter);
apiRouter.use('/jewels', jewelsRouter);
apiRouter.use('/materials', materialsRouter);
apiRouter.use('/orders', ordersRouter);
apiRouter.use('/stats', statsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/settings', settingsRouter);
apiRouter.use('/baseStructures', baseStructuresRouter);
apiRouter.use('/health', healthRouter);
apiRouter.use('/events', eventsRouter);
// Prefijo global
app.use('/api', apiRouter);

// Manejador de errores global.
app.use(errorHandler);

export default app;
