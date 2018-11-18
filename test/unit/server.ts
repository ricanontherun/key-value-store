const assert = require('assert');
import {expect} from 'chai';
import moment from 'moment';
const supertest = require('supertest');

import Application from '../../app/application';
const app = new Application({});

describe("Server test", () => {
    it ("/", (done) => {
        supertest(app.getServer())
            .get('/')
            .expect(200, 'ok', done);
    });

    describe("Validation tests", () => {
        it ("should respond with a 400 if not provided required form data.", (done) => {
            supertest(app.getServer())
                .post('/entries')
                .expect(400, done);
        });

        it ("should respond with a 404 if they requested key doesn't exist.", (done) => {
            supertest(app.getServer())
                .get('/entities/1234')
                .expect(404, done);
        });
    });
});