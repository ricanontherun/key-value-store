const assert = require('assert');
import {expect} from 'chai';
import moment from 'moment';
const supertest = require('supertest');

import server from '../../app/server';

describe("Server test", () => {
    it ("/", (done) => {
        supertest(server)
            .get('/')
            .expect(200, 'ok', done);
    });

    describe("Validation tests", () => {
        it ("should respond with a 400 if not provided required form data.", (done) => {
            supertest(server)
                .post('/entries')
                .expect(400, done);
        });

        it ("should respond with a 404 if they requested key doesn't exist.", (done) => {
            supertest(server)
                .get('/entities/1234')
                .expect(404, done);
        });
    });
});