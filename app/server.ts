global.Promise = require('bluebird');

import {default as express} from 'express';
import bodyParser from 'body-parser';

import router from './routes';

// Create a new express application instance
const app: express.Application = express();

app.use(bodyParser.json());

app.use('/', router);

const port: number = parseInt(process.env.PORT || '3000', 10);

// When the server starts up, we should start another process to
// clean up expired keys on an in interval.

// Serve the application at the given port
app.listen(port, () => {
    // Success callback
    console.log(`Listening at http://localhost:${port}/`);
});