import { expect } from 'chai';

import { safeParse, cleanQuery, isId, parseMultiPartRequest } from '../../../utils';

describe('General utils', () => {
  describe('safeParse', () => {
    it('should parse a valid json', async () => {
      expect(safeParse('{"test":1}')).to.deep.equal({ test: 1 });
    });
    it('should use a default on invalid json', async () => {
      expect(safeParse('{syntax error}', { test: 2 })).to.deep.equal({ test: 2 });
    });
  });

  describe('cleanQuery', () => {
    it('should change strings to objects', async () => {
      expect(cleanQuery('{"a":1,"b":true}')).to.deep.equal({ a: 1, b: true });
    });

    it('should change strings to regexs', async () => {
      expect(cleanQuery('{"test":"hi"}').test).to.be.an.instanceof(RegExp);
    });

    it('should NOT change id fields type, but change keys to "_id"', async () => {
      expect(typeof cleanQuery('{"id":"hi"}').id).to.equal('string');
      expect(typeof cleanQuery('{"_id":"hi"}')._id).to.equal('string');
    });

    it('should return the same query', async () => {
      expect(cleanQuery({ a: 1, b: true })).to.be.an('object');
    });

    it('sould return an empty object', async () => {
      expect(cleanQuery(null)).to.deep.equal({});
    });
  });

  describe('parseMultiPartRequest', () => {
    const mockRequest: any = {
      'headers': {
        'content-type': 'multipart/form-data',
      }};
    it('should parse a multipart request and return void', async () => {
      parseMultiPartRequest(mockRequest)
        .then(data => expect(data).to.be.an('undefined'));
    });
  });

  describe('isId', () => {
    it('should identify an "id" key', async () => {
      expect(isId('id')).to.be.true; // tslint:disable-line
      expect(isId('_id')).to.be.true; // tslint:disable-line
    });
    it('should identify a NOT "id" key', async () => {
      expect(isId('other')).to.be.false; // tslint:disable-line
    });
  });
});
