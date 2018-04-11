import { expect } from 'chai';
import { spy, SinonSpy, stub, SinonStub } from 'sinon';

import * as ioc from '../../../ioc';
import { generateMockUUID } from '../../data/models';
import { BaseRepository } from '../../../repositories/mongo/BaseRepository';

/** we need some of this stuff on runtime */
ioc; // tslint:disable-line

class Formatter extends Object { }

class BaseRepositoryExtension extends BaseRepository<any> {
  public documentModel: any;
  protected formatter = Formatter;
  constructor(customStub?: SinonStub) {
    super();
    this.documentModel = customStub || stub();
  }
}

describe('Mongo BaseRepository', () => {
  let repository: BaseRepositoryExtension;
  let cleanToSaveSpy: SinonSpy;
  beforeEach(() => {
    repository = new BaseRepositoryExtension();
    cleanToSaveSpy = spy(repository, 'cleanToSave' as any);
  });

  it('should create', async () => {
    const createStub = repository.documentModel.create = stub();
    const res = await repository.create({});
    expect(cleanToSaveSpy.calledOnce).to.be.true; // tslint:disable-line
    expect(res instanceof Formatter).to.be.true; // tslint:disable-line
    expect(createStub.calledOnce).to.be.true; // tslint:disable-line
  });

  it('should update', async () => {
    const _id = generateMockUUID();
    const updateStub = repository.documentModel.updateOne = stub();
    const res = await repository.update(_id, {});
    expect(cleanToSaveSpy.calledOnce).to.be.true; // tslint:disable-line
    expect(res).to.equal(undefined);
    expect(updateStub.calledWith({ _id }, {})).to.be.true; // tslint:disable-line
  });

  it('should delete', async () => {
    const _id = generateMockUUID();
    const deleteStub = repository.documentModel.deleteOne = stub();
    await repository.delete(_id);
    expect(cleanToSaveSpy.calledOnce).to.be.false; // tslint:disable-line
    expect(deleteStub.calledWith({ _id })).to.be.true; // tslint:disable-line
  });

  it('should find', async () => {
    const findStub = repository.documentModel.find = stub().returns(repository.documentModel);
    const sortStub = repository.documentModel.sort = stub().returns(repository.documentModel);
    const skipStub = repository.documentModel.skip = stub().returns(repository.documentModel);
    const limitStub = repository.documentModel.limit = stub().returns([{}]);
    const res = await repository.find(5, 10, '{"name":"asc"}', '{"name":"example"}');
    expect(findStub.calledWith({ name: new RegExp('example', 'i') })).to.be.true; // tslint:disable-line
    expect(sortStub.calledWith([['name', 1]])).to.be.true; // tslint:disable-line
    expect(skipStub.calledWith(5)).to.be.true; // tslint:disable-line
    expect(limitStub.calledWith(10)).to.be.true; // tslint:disable-line
    expect(res[0]).to.be.an.instanceof(Formatter);
  });

  it('should find one', async () => {
    const _id = generateMockUUID();
    const findOneStub = repository.documentModel.findOne = stub().returns({});
    const res = await repository.findOne({ _id });
    expect(cleanToSaveSpy.calledOnce).to.be.false; // tslint:disable-line
    expect(findOneStub.calledWith({ _id })).to.be.true; // tslint:disable-line
    expect(res).to.be.an.instanceof(Formatter);
  });

  it('should FAIL to find one', async () => {
    let fails;
    try {
      await repository.findOne({});
      fails = false;
    } catch {
      fails = true;
    }
    expect(fails).to.be.true; // tslint:disable-line
  });

  it('should count', async () => {
    const _id = generateMockUUID();
    const countStub = repository.documentModel.count = stub().returns(1);
    await repository.count(`{"_id":"${_id}"}`);
    expect(countStub.calledWith({ _id })).to.be.true; // tslint:disable-line
  });
});
