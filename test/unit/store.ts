const assert = require('assert');
import {expect} from 'chai';

import Item from '../../app/store/item'

import {Store} from '../../app/store';

describe("Store Tests", () => {
  describe("Basic operations", () => {
    it ("Can get/set/delete key/value pairs", () => {
      const options = {
        store: {
          maxSize: 1000
        },
      };
      const store = new Store(options);

      store.Set("name", "Christian", {}).then((item : Item) => {
        expect(store.items).to.haveOwnProperty("name");
        expect(store.Has("name")).to.be.true;

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
    it ("will return an error when the insertion item is larger than the configured memory", (done) => {
      const store = new Store({
        store: {
          maxSize: 100
        }
      });
      const ret = store.Set("name", "i".repeat(1000), {}).then(() => {
        done("then() was called, should not have been.");
      }).catch((err : any) => {
        expect(err.name).to.equal("ErrorItemTooLarge");
        done();
      })
    })
  });
});
