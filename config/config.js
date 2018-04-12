'use strict';

console.log('Loading DB config for env:', process.env.NODE_ENV);

const pathResolve = require('path').resolve;
const config = require('dotenv').config;

config({ path: pathResolve(__dirname, `../src/config/env/.env.${process.env.NODE_ENV}`) });

module.exports = {
  username: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DB,
  host: process.env.SQL_HOST,
  dialect: process.env.SQL_DIALECT
};
