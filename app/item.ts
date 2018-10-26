import moment from 'moment';

export default class Item {
    key: string;
    value: any;
    ttl: number;
    dateExpires?: Date;

    constructor(key: string, value: any, ttl: number = 0) {
        this.key = key;
        this.value = value;
        this.ttl = ttl;

        if (ttl != 0) {
            // Determine the expiration date for this item.
            this.dateExpires = moment().add(ttl, 'seconds').toDate();
        }
    }

    get expired() : boolean {
        if (!this.dateExpires) {
            return false;
        }

        return moment().isAfter(this.dateExpires);
    }
}