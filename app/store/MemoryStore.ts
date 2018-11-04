const sizeof = require('object-sizeof');

import {StoreInterface} from './StoreInterface';
import Item from '../item';
import {default as StoreOpts, MemoryLimitPolicy} from './StoreOpts';
import StoreStats from './StoreStats';
import {ErrorItemTooLarge, ErrorMemoryLimitReached} from '../errors';

export default class MemoryStore implements StoreInterface {
    private opts: StoreOpts;
    private stats: StoreStats;

    constructor(opts: StoreOpts) {
        this.opts = opts;
        this.stats = new StoreStats;
    }

    // Key/value pairs.
    private __items: { [s:string] : Item; } = {};

    get items() : { [s:string] : Item; } {
        return this.__items;
    }

    Set(key: string, value: any, ttl: number = 0) : Promise<any> {
        const item: Item = new Item(value, ttl);

        // Obviously cannot insert if size of object exceeds set limit.
        if (item.size > this.opts.maxSize) {
            return Promise.reject(new ErrorItemTooLarge);
        }

        if (this.__items.hasOwnProperty(key)) {
            let memorySizeBytesDelta = this.__items[key].size - item.size

            if ((this.stats.memorySizeBytes + memorySizeBytesDelta) > this.opts.maxSize) {
                if (this.opts.memoryLimitPolicy === MemoryLimitPolicy.MEMORY_LIMIT_POLICY_ERROR) {
                    return Promise.reject(new ErrorMemoryLimitReached);
                }

                this.__evict();
            }

            this.stats.memorySizeBytes += memorySizeBytesDelta;

        } else {
            const size = sizeof(key) + item.size;

            if (this.stats.memorySizeBytes + size > this.opts.maxSize) {
                if (this.opts.memoryLimitPolicy === MemoryLimitPolicy.MEMORY_LIMIT_POLICY_ERROR) {
                    return Promise.reject(new ErrorMemoryLimitReached);
                }

                this.__evict();
            }

            this.stats.memorySizeBytes += size;
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
            const deleted = this.__items[key];

            delete this.__items[key];

            this.stats.memorySizeBytes -= sizeof(key) + deleted.size;
        }

        return Promise.resolve(existed);
    }

    __evict() : boolean {
        return false;
        // Execute an appropriate action depending on the
        //
        // Sort the object by least recently accessed.
        // While the store size is greater than the max.
    }
}