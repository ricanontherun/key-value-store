import {default as express, Request, Response, Router} from 'express';

import {
    Opts,
    Store,
} from './store';

import Item from './store/item'

const opts = (new Opts).setMaxSize(1024);
const store = new Store(opts);
const DEFAULT_STORE_TTL: number = 60; // seconds.

const router = Router();

const requesetErrorHandler = (res: Response, err: Error) => {
    const name = err.name;

    if (!name) {
        return res.status(500).send("An unknown error occured.");
    }

    switch (name) {
        case 'ErrorItemTooLarge':
        case 'ErrorMemoryLimitReached':
            return res.status(413).send("Memory Limit Reached");
        default:
            return res.status(500).send("An unknown error occured");
    }
}

const middlewarePostEntries = (req: Request, res: Response, next: Function) => {
    if (!req.body.key) {
        return res.status(400).send("Invalid request: Missing key");
    }

    if (!req.body.value) {
        return res.status(400).send("Invalid request: Missing value");
    }

    next();
}

router.get('/', (req: Request, res: Response) => {
    return res.status(200).send('ok');
});

router.post('/entries', [middlewarePostEntries], async (req: Request, res: Response) => {
    const { key, value } = req.body;


    return store
        .Set(req.body.key, req.body.value, DEFAULT_STORE_TTL).then(() => {
            res.send('ok');
        })
        .catch(requesetErrorHandler.bind(null, res));
});

router.put("/items/:key", () => {

});

router.get('/entries/:key', (req: Request, res: Response) => {
    // store.Has()
    return store.Get(req.params.key).then((item: Item) => {
        if (!item) {
            return res.status(404).send(null);
        }

        // Lazy check for expiration. Delete the item if it has expired.
        if (item.expired) {
            store.Delete(req.params.key).then(() => {
                res.status(404).send(null);
            }).catch(requesetErrorHandler.bind(null, res));
        } else {
            res.send(item.value);
        }
    }).catch(requesetErrorHandler.bind(null, res));
});

router.delete("/entries/:key", (req: Request, res: Response) => {
    return store.Delete(req.params.key).then(() => {
        return res.send('ok');
    }).catch(requesetErrorHandler.bind(null, res));
});

export default router;