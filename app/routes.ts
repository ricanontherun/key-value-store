import {default as express, Request, Response, Router} from 'express';

import {
    MemoryStore
} from './stores';

import Item from './item'

// TODO: Is there anyway to type hint an interface?
const store = new MemoryStore;
const DEFAULT_STORE_TTL: number = 60; // seconds.

const router = Router();

const genericErrorHandler = (res: Response, err: Error) => {
    console.error(err);

    return res.status(500).send('Something went wrong.')
}

router.get('/', (req: Request, res: Response) => {
    return res.status(200).send('listen buddy');
});

router.post('/entries', (req: Request, res: Response) => {
    return store.Add(req.body.key, req.body.value, DEFAULT_STORE_TTL).then(() => {
        res.send('ok');
    }).catch(genericErrorHandler.bind(null, res));
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
            }).catch(genericErrorHandler.bind(null, res));
        } else {
            res.send(item.value);
        }
    }).catch(genericErrorHandler.bind(null, res));
});

router.delete("/entries/:key", (req: Request, res: Response) => {
    return store.Delete(req.params.key).then(() => {
        return res.send('ok');
    }).catch(genericErrorHandler.bind(null, res));
});

export default router;