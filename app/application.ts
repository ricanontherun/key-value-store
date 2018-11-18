global.Promise = require('bluebird');

import {
    openSync,
    createWriteStream,
    closeSync,
    readFileSync
} from 'fs';

import {
    Writable
} from 'stream';

import {default as express} from 'express';
import bodyParser from 'body-parser';

const {get} = require('lodash');

import router from './routes';
import Logger from './log';

import {
    Opts,
    Store,
} from './store';

export default class Application {
    private server !: express.Application
    private store : Store;
    private options : any;

    constructor(options : any) {
        this.options = options;

        // TOOD: Create opts from incoming options argument.
        const opts = (new Opts).setMaxSize(this.options.store.maxSize);
        this.store = new Store(opts);

        this.setupServer();

        if (get(this.options, 'persistence.enabled') == true) {
            this.setupPersistence();
        }
    }

    private setupServer() {
        this.server = express();

        // Middleware
        this.server.use(bodyParser.json());

        // Routes
        this.server.use('/', router(this.store));
    }

    private setupPersistence() {
        Logger.info('Persistence enabled, setting up...');

        const dbPath = this.options.persistence.dbPath;

        try {
            openSync(dbPath, 'r')
        } catch (readErr) {
            Logger.info(`Database file '${dbPath}' does not exist, creating...`)
            closeSync(openSync(dbPath, 'w'));
        }

        // Populate the store from disk.
        this.hydrate(dbPath);

        // Create an interval on which to dump store contents to disk as JSON.
        setInterval(this.dump.bind(this, dbPath), this.options.persistence.writeInterval * 1000);
    }

    /**
     * Write the contents of the store to disk.
     *
     * @param dbPath
     */
    private dump(dbPath : string) {
        Logger.info('Dumping store contents to disk...');

        const writer = createWriteStream(dbPath);
        writer.write(JSON.stringify(this.store.items));
        writer.on('finish', () => {
            Logger.info('Finished writing store contents to disk.');
        });
        writer.end();
    }

    private hydrate(dbPath : string) {
        let json : any;

        try {
            json = JSON.parse(readFileSync(dbPath).toString());
        } catch (readErr) {
            Logger.error(`Failed to read/parse contents of '${dbPath}': ${readErr}`);
            return;
        }

        const keys = Object.keys(json);

        if (keys.length) {
            keys.forEach((key) => {
                this.store.SetFromJSON(key, json[key]);
            });

            Logger.info(`Hydrated store with ${keys.length} items.`);
        }
    }

    getServer() {
        return this.server;
    }

    start() {
        // Serve the application at the given port
        this.server.listen(this.options.http.port, () => {
            Logger.info(`Listening at http://localhost:${this.options.http.port}/`);
        });
    }
}