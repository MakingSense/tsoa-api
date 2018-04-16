import { expect } from 'chai';
import { spy, SinonSpy, stub, SinonStub } from 'sinon';
import * as Sequelize from 'sequelize';

import * as ioc from '../../../ioc';
import { generateMockUUID } from '../../data/models';
import { BaseRepository } from '../../../repositories/sql/BaseRepository';

/** we need some of this stuff on runtime */
ioc; // tslint:disable-line

class Formatter extends Object { }

class BaseRepositoryExtension extends BaseRepository<any> {
  public entityModel: any;
  protected getInclude = [];
  protected saveInclude = [];
  protected formatter = Formatter;
  constructor(customStub?: SinonStub) {
    super();
    this.entityModel = { model: customStub || stub() };
  }
}

describe('SQL BaseRepository', () => {
  let repository: BaseRepositoryExtension;
  let cleanToSaveSpy: SinonSpy;
  beforeEach(() => {
    repository = new BaseRepositoryExtension();
    cleanToSaveSpy = spy(repository, 'cleanToSave' as any);
  });

  it('should create', async () => {
    const createStub = repository.entityModel.model.create = stub();
    const res = await repository.create({});
    expect(cleanToSaveSpy.calledOnce).to.be.true; // tslint:disable-line
    expect(res instanceof Formatter).to.be.true; // tslint:disable-line
    expect(createStub.calledOnce).to.be.true; // tslint:disable-line
  });

  it('should update', async () => {
    const _id = generateMockUUID();
    const updateStub = repository.entityModel.model.update = stub();
    const res = await repository.update(_id, {});
    expect(cleanToSaveSpy.calledOnce).to.be.true; // tslint:disable-line
    expect(res).to.equal(undefined);
    expect(updateStub.calledWith({}, { where: { _id } })).to.be.true; // tslint:disable-line
  });

  it('should delete', async () => {
    const _id = generateMockUUID();
    const deleteStub = repository.entityModel.model.destroy = stub();
    await repository.delete(_id);
    expect(cleanToSaveSpy.calledOnce).to.be.false; // tslint:disable-line
    expect(deleteStub.calledWith({ where: { _id } })).to.be.true; // tslint:disable-line
  });

  it('should find', async () => {
    const findAllStub = repository.entityModel.model.findAll = stub().returns([{}]);
    const options = {
      include: [],
      where: { name: { [Sequelize.Op.like]: '%example%' } },
      offset: 5,
      limit: 10,
      order: [['name', 'asc']]
    };
    const res = await repository.find(5, 10, '{"name":"asc"}', '{"name":"example"}');
    expect(findAllStub.calledWith(options)).to.be.true; // tslint:disable-line
    expect(res[0]).to.be.an.instanceof(Formatter);
  });

  it('should find one', async () => {
    const _id = generateMockUUID();
    const findOneStub = repository.entityModel.model.findOne = stub().returns({});
    const res = await repository.findOne({ _id });
    expect(cleanToSaveSpy.calledOnce).to.be.false; // tslint:disable-line
    expect(findOneStub.calledWith({ where: { _id }, include: [] })).to.be.true; // tslint:disable-line
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
    const countStub = repository.entityModel.model.count = stub().returns(1);
    await repository.count(`{"_id":"${_id}"}`);
    expect(countStub.calledWith({ where: { _id: { [Sequelize.Op.eq]: _id } } })).to.be.true; // tslint:disable-line
  });

  it('should clean to save', async () => {
    expect((repository as any).cleanToSave({ a: 1 })).to.be.an.instanceof(Formatter);
  });

  it('should format a sort query', async () => {
    expect((repository as any).sortQueryFormatter(null, 'asc')).to.equal('asc');
    expect((repository as any).sortQueryFormatter(null, 'desc')).to.equal('desc');
    expect((repository as any).sortQueryFormatter(null, 'invalid')).to.equal(undefined);
  });

  it('should clean a sort query', async () => {
    expect((repository as any).cleanSort('{"name":"asc"}')).to.deep.equal({ name: 'asc' });
  });

  it('should format a where query', async () => {
    const fn = (repository as any).whereQueryFormatter;
    expect(fn('a', [])).to.deep.equal({ [Sequelize.Op.or]: [] });
    expect(fn('id', 'a')).to.deep.equal({ [Sequelize.Op.eq]: 'a' });
    expect(fn('a', 'a')).to.deep.equal({ [Sequelize.Op.like]: '%a%' });
    expect(fn('a', 5)).to.deep.equal({ [Sequelize.Op.like]: 5 });
  });

  it('should clean a where query', async () => {
    const fn = (repository as any).cleanWhere.bind(repository);
    expect(fn(JSON.stringify({ name: 'a' }))).to.deep.equal({ name: { [Sequelize.Op.like]: '%a%' } });
  });
});
