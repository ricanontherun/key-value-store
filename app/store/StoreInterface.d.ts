import Item from "../item";

export interface StoreInterface {
    Set(key: string, value: any, ttl: number) : Promise<Item>;
    Get(key: string) : Promise<Item>;
    Delete(key: string) : Promise<boolean>;
}