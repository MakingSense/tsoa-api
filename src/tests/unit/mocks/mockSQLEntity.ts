import { stub } from 'sinon';

export const generateEntity = (mock?: any): any => ({
  model: {
    destroy: stub().returns(mock),
    create: stub().returns(mock),
    update: stub(),
    bulkUpdate: stub(),
    findAll: stub().returns([mock]),
    findOne: stub().returns(mock),
    bulkCreate: stub().returns(mock)
  }
});
