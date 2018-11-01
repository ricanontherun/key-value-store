const assert = require('assert');
import {expect} from 'chai';

import {StoreOpts, MemoryStore} from '../../app/store';

describe("MemoryStore Tests", () => {
    describe("Basic operations", () => {
        it ("Can accepts StoreOpts via it's constructor", () => {
            const store = new MemoryStore(new StoreOpts);

            expect(store).to.have.property('opts');
        });

        it ("Can set key/value pairs", () => {
            const options = (new StoreOpts).setMaxSizeBytes(1000);
            const store = new MemoryStore(options);

            store.Set("name", "Christian");
        });
    });
});