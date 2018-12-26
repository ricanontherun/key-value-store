import {default as express, Request, Response, Router} from 'express';

import {Store} from './store'
import Item from './store/item'

const DEFAULT_STORE_TTL: number = 60; // seconds.

// TODO: Is there a better way to depdency inject the store?
export default (store : Store) => {
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

    if (req.body.ttl) {
      const ttl = parseInt(req.body.ttl || DEFAULT_STORE_TTL);

      if (isNaN(ttl)) {
        return res.status(400).send('Invalid ttl');
      }

      req.body.ttl = ttl;
    }

    next();
  }

  router.get('/', (req: Request, res: Response) => {
    return res.status(200).send('ok');
  });

  router.post('/entries', [middlewarePostEntries], async (req: Request, res: Response) => {
    const {key, value, ttl} = req.body;

    try {
      await store.Set(key, value, ttl);
    } catch (err) {
      return requesetErrorHandler(res, err);
    }

    return res.send('ok');
  });

  router.get('/entries/:key', async (req: Request, res: Response) => {
    const {key} = req.params;

    if (!store.Has(key)) {
      return res.status(404).end();
    }

    let item;

    try {
      item = await store.Get(key);
    } catch (err) {
      return requesetErrorHandler(res, err);
    }

    // Lazy expiration check.
    if (!item.expired) {
      return res.send(item.value);
    }

    try {
      await store.Delete(key);
    } catch (err) {
      return requesetErrorHandler(res, err);
    }

    return res.status(404).end();
  });

  router.delete("/entries/:key", async (req: Request, res: Response) => {
    try {
      await store.Delete(req.params.key);
    } catch (err) {
      return requesetErrorHandler(res, err);
    }

    return res.send('ok');
  });

  return router;
}
