import {default as express, Request, Response, Router} from 'express';

import {
    StoreOpts,
    MemoryStore,
} from './store';
import {ErrorBadRequest} from './errors';
import Item from './item'

// TODO: Is there anyway to type hint an interface?
const storeOpts = new StoreOpts;
storeOpts.setMaxSize(1);

const store = new MemoryStore(storeOpts);

const DEFAULT_STORE_TTL: number = 60; // seconds.

const router = Router();

const apiErrorResponseHandler = (res: Response, err: any) => {
    console.log(err.name);
    // We'll need to determine what kind of error happened.
    if (err instanceof ErrorBadRequest) {
        console.log('thing');
    }

    return res.status(500).send('Something went wrong.')
}

const middlewarePostEntries = (req: Request, res: Response, next: Function) => {
    const { key, value } = req.body;

    if (!key) {
        return res.status(400).send("Invalid request: Missing key");
    }

    if (!value) {
        return res.status(400).send("Invalid request: Missing value");
    }

    // CHeck if ttl is provided, if not use default.
    req.body.ttl = parseInt(req.body.ttl || DEFAULT_STORE_TTL, 10);

    return next();
}

router.get('/', (req: Request, res: Response) => {
    return res.status(200).send('ok');
});

router.post('/entries', [middlewarePostEntries],  (req: Request, res: Response) => {
    return store
        .Set(req.body.key, req.body.value, DEFAULT_STORE_TTL).then(() => {
            res.send('ok');
        })
        .catch((err) => {
            apiErrorResponseHandler(res, err);
        });
});

router.get('/entries/:key', (req: Request, res: Response) => {
    return store.Get(req.params.key).then((item: Item) => {
        if (!item) {
            return res.status(404).send(null);
        }

        // Lazy check for expiration. Delete the item if it has expired.
        if (item.expired) {
            store.Delete(req.params.key).then(() => {
                res.status(404).send(null);
            }).catch(apiErrorResponseHandler.bind(null, res));
        } else {
            res.send(item.value);
        }
    }).catch(apiErrorResponseHandler.bind(null, res));
});

router.delete("/entries/:key", (req: Request, res: Response) => {
    return store.Delete(req.params.key).then(() => {
        return res.send('ok');
    }).catch(apiErrorResponseHandler.bind(null, res));
});

export default router;