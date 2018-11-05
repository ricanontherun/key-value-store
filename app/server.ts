global.Promise = require('bluebird');

import {default as express} from 'express';
import bodyParser from 'body-parser';

import router from './routes';

// Create a new express application instance
const app: express.Application = express();

app.use(bodyParser.json());

app.use('/', router);

export default app;