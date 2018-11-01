const sizeof = require('object-sizeof');

import {StoreInterface} from './StoreInterface';
import Item from '../item';
import StoreOpts from './opts';

export default class MemoryStore implements StoreInterface {
    opts: StoreOpts;
    memorySizeBytes: number = 0;

    constructor(opts: StoreOpts) {
        this.opts = opts;
    }

    // Key/value pairs.
    private __items: { [s:string] : Item; } = {};

    get items() : { [s:string] : Item; } {
        return this.__items;
    }

    get stats() {
        return null;
    }

    Set(key: string, value: any, ttl: number = 0) : Promise<Item> {
        const item: Item = new Item(value, ttl);

        if (this.__items.hasOwnProperty(key)) {
            let memorySizeBytesDelta = this.__items[key].size - item.size

            if ((this.memorySizeBytes + memorySizeBytesDelta) > this.opts.maxSizeBytes) {
                this.__evict();
            }

            this.memorySizeBytes += memorySizeBytesDelta;

        } else {
            const size = sizeof(key) + item.size;

            if (this.memorySizeBytes + size > this.opts.maxSizeBytes) {
                this.__evict();
            }

            this.memorySizeBytes += size;
        }

        this.__items[key] = item;

        return Promise.resolve(item);
    }

    Get(key: string) : Promise<Item> {
        return Promise.resolve(this.__items[key] || null);
    }

    Delete(key: string) : Promise<boolean> {
        const existed = this.__items.hasOwnProperty(key);

        if (existed) {
            delete this.__items[key];
            this.memorySizeBytes -= sizeof(key) + sizeof(this.__items[key]);
        }

        return Promise.resolve(existed);
    }

    __evict() {
        // Execute an appropriate action depending on the
        //
        // Sort the object by least recently accessed.
        // While the store size is greater than the max.
    }
}