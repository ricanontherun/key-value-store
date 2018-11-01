const assert = require('assert');
import {expect} from 'chai';

import Item from '../../app/item'

import {StoreOpts, MemoryStore} from '../../app/store';

describe("MemoryStore Tests", () => {
    describe("Basic operations", () => {
        it ("Can accepts StoreOpts via it's constructor", () => {
            const store = new MemoryStore(new StoreOpts);

            expect(store).to.have.property('opts');
        });

        it ("Can get/set/delete key/value pairs", () => {
            const options = (new StoreOpts).setMaxSizeBytes(1000);
            const store = new MemoryStore(options);

            store.Set("name", "Christian").then((item : Item) => {
                expect(store.items).to.haveOwnProperty("name");

                store.Get("name").then((item : Item) => {
                    expect(item.value).to.equal("Christian");

                    store.Delete("name").then(() => {
                        expect(store.items).to.not.haveOwnProperty("name");
                    });
                });
            });
        });
    });

    describe("Memory Management", () => {

    })
});