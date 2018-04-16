import { expect } from 'chai';

import { ImmutabilityHelper } from '../../../utils';

describe('Immutability Helper', () => {
  it('"getType" should get types', async () => {
    expect(ImmutabilityHelper.getType('string')).to.equal('string');
    expect(ImmutabilityHelper.getType(true)).to.equal('boolean');
    expect(ImmutabilityHelper.getType(1)).to.equal('number');
    expect(ImmutabilityHelper.getType({})).to.equal('object');
    expect(ImmutabilityHelper.getType([])).to.equal('array');
    expect(ImmutabilityHelper.getType(null)).to.equal('null');
    expect(ImmutabilityHelper.getType(undefined)).to.equal('undefined');
  });
  it('should return an error', async () => {
    expect(() => new ImmutabilityHelper()).to.throw(Error, 'just don\'t...');
  });
  it('"immute" should clone a variable', async () => {
    const shallow = { a: 1 };
    const copy = ImmutabilityHelper.immute<any>(shallow);
    copy.a = 2;
    expect(shallow.a).not.to.equal(copy.a);
  });
  it('"copy" should deep clone a variable', async () => {
    const deep = { a: 1, b: { c: 3, d: [1, 2, 3] } };
    const copy = ImmutabilityHelper.copy<any>(deep);
    copy.a = 10;
    copy.b.c = 20;
    copy.b.d.push(40);
    expect(deep).not.to.deep.equal(copy);
  });
});
