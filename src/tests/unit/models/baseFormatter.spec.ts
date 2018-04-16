import { expect } from 'chai';

import { BaseFormatter } from '../../../models/BaseFormatter';

class Formatter extends BaseFormatter {
  public dummy: string = null;
  constructor(args: any) {
    super();
    this.format(args);
  }
}

describe('BaseFormatter', () => {
  it('should format ids', () => {
    const formatted = new Formatter({ _id: 'a' });
    expect(formatted.id).to.equal('a');
    expect(formatted._id).to.equal('a');
  });

  it('should format extention props', () => {
    const formatted = new Formatter({ dummy: 'a' });
    expect(formatted.dummy).to.equal('a');
  });

  it('should format use toJSON if present', () => {
    const formatted = new Formatter({ toJSON: () => ({ dummy: 'a' }) });
    expect(formatted.dummy).to.equal('a');
  });

  it('should ignore undefined args props', () => {
    const formatted = new Formatter({});
    expect(formatted.dummy).to.equal(null);
  });
});
