const assert = require('assert');
import {expect} from 'chai';
import moment from 'moment';
const sizeof = require('object-sizeof');

import Item from "../../app/store/item";

describe('Tests for Item class', () => {
    it("wont expire if it's not given a TTL", () => {
        const item = new Item('', 0);

        expect(item.expired).to.equal(false);
    });

    it('will expire if given a TTL', (done) => {
        const ttl = 1;
        const item = new Item('', ttl);

        expect(item.expired).to.equal(false);

        setTimeout(() => {
            expect(item.expired).to.equal(true);
            done();
        }, ttl * 1000);
    });

    it('knows when it was last accessed', () => {
        const now = moment().toDate();
        const item = new Item('', 0);
        assert(item.lastAccessed.getTime() >= now.getTime());
    });

    it ('will update its last access time when updating', (done) => {
        const item = new Item('', 0);

        const firstAccess = item.lastAccessed;

        setTimeout(() => {
            item.value = "1234";
            const secondAccess = item.lastAccessed;
            expect(secondAccess).to.be.greaterThan(firstAccess);
            done();
        }, 1000);
    });

    it ('will update its last access time when reading', (done) => {
        const item = new Item('', 0);

        const firstAccess = item.lastAccessed;

        setTimeout(() => {
            const value = item.value;
            const secondAccess = item.lastAccessed;
            expect(secondAccess).to.be.greaterThan(firstAccess);
            done();
        }, 1000);
    });

    it ('knows its memory size in bytes', () => {
        const item = new Item('', 100);

        expect(item.size).to.equal(sizeof(item));
    });
});