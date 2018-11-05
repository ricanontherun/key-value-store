const sizeof = require('object-sizeof');

import Item from './item';
import {Opts, MemoryLimitPolicyEnum} from './opts';
import Stats from './stats';
import {ErrorItemTooLarge, ErrorMemoryLimitReached} from './errors';

export default class Store {
    private opts: Opts;
    private stats: Stats;

    constructor(opts: Opts) {
        this.opts = opts;
        this.stats = new Stats;
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
            return Promise.reject(new ErrorItemTooLarge("Item too large"));
        }

        if (this.__items.hasOwnProperty(key)) {
            let memorySizeBytesDelta = this.__items[key].size - item.size

            if ((this.stats.memorySizeBytes + memorySizeBytesDelta) > this.opts.maxSize) {
                if (this.opts.memoryLimitPolicy === MemoryLimitPolicyEnum.MEMORY_LIMIT_POLICY_ERROR) {
                    return Promise.reject(new ErrorMemoryLimitReached);
                }

                this.__evict();
            }

            this.stats.memorySizeBytes += memorySizeBytesDelta;

        } else {
            const size = sizeof(key) + item.size;

            if (this.stats.memorySizeBytes + size > this.opts.maxSize) {
                if (this.opts.memoryLimitPolicy === MemoryLimitPolicyEnum.MEMORY_LIMIT_POLICY_ERROR) {
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

    Has(key : string) : boolean {
        return this.__items.hasOwnProperty(key);
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