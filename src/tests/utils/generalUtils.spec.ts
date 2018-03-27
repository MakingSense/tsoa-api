import { expect } from 'chai';

import { safeParse, cleanQuery } from '../../utils';

describe('General utils', () => {
  describe('safeParse', () => {
    it('should parse a valid json', async () => {
      expect(safeParse('{"test":1}')).to.deep.equal({ test: 1 });
    });
    it('should use a default on invalid json', async () => {
      expect(safeParse('{syntax error}', { test: 2 })).to.deep.equal({ test: 2 });
    });
  })

  describe('cleanQuery', () => {
    it('should change strings to regexs', async () => {
      expect(cleanQuery({ test: 'hi' }).test).to.be.an.instanceof(RegExp);
    });
    it('should NOT change id fields type, but change keys to "_id"', async () => {
      expect(typeof cleanQuery({ id: 'hi' })._id).to.equal('string');
      expect(typeof cleanQuery({ _id: 'hi' })._id).to.equal('string');
    });
  })
});
