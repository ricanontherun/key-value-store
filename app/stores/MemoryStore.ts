import {StoreInterface} from './interfaces/StoreInterface';
import Item from '../item';

export default class MemoryStore implements StoreInterface {
    // Apparently in TS, this is how you define a key/value pair.
    // Specifically one that has string/any pairs.
    private items: { [s:string] : any; } = {};

    Add(key: string, value: any, ttl: number = 0) : Promise<void> {
        const item: Item = new Item(key, value, ttl);

        this.items[key] = item;

        return Promise.resolve();
    }

    Get(key: string) : Promise<Item> {
        return Promise.resolve(this.items[key] || null);
    }

    Delete(key: string) : Promise<boolean> {
        const existed = this.items.hasOwnProperty(key);

        if (existed) {
            delete this.items[key];
        }

        return Promise.resolve(existed);
    }
}