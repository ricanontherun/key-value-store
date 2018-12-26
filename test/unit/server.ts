const assert = require('assert');
import {expect} from 'chai';
import moment from 'moment';
const supertest = require('supertest');

import Application from '../../app/application';
const app = new Application({
  store: {
    maxSize: 1024
  }
});

describe("Server test", () => {
  it ("/", (done) => {
    supertest(app.getServer())
      .get('/')
      .expect(200, 'ok', done);
  });

  describe("Validation tests", () => {
    it ("should respond with a 400 is not provided a value", (done) => {
      supertest(app.getServer())
        .post('/entries')
        .send({key: "name"})
        .expect(400, done);
    });

    it ("should respond with a 400 if not provided a key", (done) => {
      supertest(app.getServer())
        .post('/entries')
        .send({value: 1234})
        .expect(400, done);
    });

    it ("should response with a 400 if provided a ttl which is NaN", (done) => {
      supertest(app.getServer())
        .post('/entries')
        .send({key: "thing", value: 1234, ttl: {}})
        .expect(400, done);
    })

    it ("should not respond with a 400 if provided key and value", (done) => {
      supertest(app.getServer())
        .post('/entries')
        .send({key: "name", value: 1234})
        .expect(200, done);
    })

    it ("should respond with a 404 if they requested key doesn't exist.", (done) => {
      supertest(app.getServer())
        .get('/entities/1234')
        .expect(404, done);
    });
  });
});
