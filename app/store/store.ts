const sizeof = require('object-sizeof');

import Item from './item';
import {Opts, MemoryLimitPolicyEnum} from './opts';
import Stats from './stats';
import {ErrorItemTooLarge, ErrorMemoryLimitReached} from './errors';

export default class Store {
    private opts: Opts;
    private stats: Stats;
    private __items: { [s:string] : Item; } = {};

    constructor(opts: Opts) {
        this.opts = opts;
        this.stats = new Stats;
    }

    get items() : { [s:string] : Item; } {
        return this.__items;
    }

    /**
     * Insert a key/value pair, where the value is a plain old JSON object.
     * This function is generally only used when hydrating the store from disk.
     *
     * @param key
     * @param json
     */
    SetFromJSON(key : string, json : any) {
        this._Set(key, Object.setPrototypeOf(json, Item.prototype));
    }

    Set(key: string, value: any, ttl: number = 0) : Promise<any> {
        return this._Set(key, new Item(value, ttl));
    }

    private _Set(key : string, item : Item) {
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