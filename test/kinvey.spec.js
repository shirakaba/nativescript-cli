import './setup';
import { Kinvey } from '../src/kinvey';
import { Client } from '../src/client';
import { loginUser, logoutUser } from './utils/user';
import { randomString } from '../src/utils/string';
import nock from 'nock';
import chai from 'chai';
const expect = chai.expect;
const appdataNamespace = process.env.KINVEY_DATASTORE_NAMESPACE || 'appdata';

describe('Kinvey', function () {
  describe('init()', function () {
    it('should respond', function () {
      expect(Kinvey).itself.to.respondTo('init');
    });

    it('should return a client', function() {
      expect(Kinvey.init({
        appKey: randomString(),
        appSecret: randomString()
      })).to.be.an.instanceof(Client);
    });
  });

  describe('ping()', function() {
    after(function() {
      return logoutUser();
    });

    it('should respond', function() {
      expect(Kinvey).itself.to.respondTo('ping');
    });

    it('should return a response when there is no active user', function() {
      const reply = {
        version: 1,
        kinvey: 'hello tests',
        appName: 'tests',
        environmentName: 'development'
      };
      nock(this.client.baseUrl)
        .get(`/${appdataNamespace}/${this.client.appKey}`)
        .query(true)
        .reply(200, reply, {
          'content-type': 'application/json'
        });

      return Kinvey.ping().then(response => {
        expect(response).to.deep.equal(reply);
      });
    });

    it('should return a response when there is an active user', function() {
      const reply = {
        version: 1,
        kinvey: 'hello tests',
        appName: 'tests',
        environmentName: 'development'
      };
      nock(this.client.baseUrl)
        .get(`/${appdataNamespace}/${this.client.appKey}`)
        .query(true)
        .reply(200, reply, {
          'content-type': 'application/json'
        });

      loginUser();
      return Kinvey.ping().then(response => {
        expect(response).to.deep.equal(reply);
      });
    });
  });
});
