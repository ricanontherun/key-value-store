import Item from "../../item";

export interface StoreInterface {
    Add(key: string, value: any, ttl: number) : Promise<void>;
    Get(key: string) : Promise<Item>;
    Delete(key: string) : Promise<boolean>;
}