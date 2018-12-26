import moment from 'moment';
const sizeof = require('object-sizeof');

export default class Item {
  __value: any = null;
  __ttl: number = 0;
  __size: number = 0;
  __dateExpires?: Date;
  __lastAccessed!: Date;

  constructor(value: any, ttl: number = 0) {
    this.__value = value;
    this.__ttl = ttl;

    this.touch();

    if (ttl != 0) {
      // Determine the expiration date for this item.
      this.__dateExpires = moment().add(ttl, 'seconds').toDate();
    }

    this.__size = sizeof(this);
  }

  get value() {
    this.touch();
    return this.__value;
  }

  set value(value: any) {
    this.__value = value;
    this.touch();
  }

  get lastAccessed() {
    return this.__lastAccessed;
  }

  get size() {
    return this.__size;
  }

  set size(size : number) {
    this.size = size;
    this.touch();
  }

  get expired() : boolean {
    if (!this.__dateExpires) {
      return false;
    }

    return moment().isAfter(this.__dateExpires);
  }

  touch() {
    this.__lastAccessed = moment().toDate();
  }
}
