import Item from './item';

export default interface StoreInterface {
  SetFromJSON(key: string, json: object) : void;

  Set(key: string, value: string, options: any) : Promise<any>;
  Get(key: string) : Promise<Item>;
  Has(key : string) : boolean;
  Delete(key: string) : Promise<boolean>;
};
