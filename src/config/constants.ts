import { resolve as pathResolve } from 'path';
import { config } from 'dotenv';

const { env } = process;
config({ path: pathResolve(__dirname, `./env/.env.${env.NODE_ENV}`) });

export default {
  environment: env.NODE_ENV,
  port: Number(env.PORT),
  mongoConnectionString: env.MONGO_CONNECTION_STRING,
  SQL: {
    db: env.SQL_DB,
    username: env.SQL_USERNAME,
    password: env.SQL_PASSWORD,
    host: env.SQL_HOST,
    port: Number(env.SQL_PORT),
    dialect: env.SQL_DIALECT
  },
  AWS: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    mainBucket: env.AWS_MAINBUCKET
  },
  auth0: {
    domain: env.AUTH0_DOMAIN,
    clientId: env.AUTH0_CLIENT_ID,
    clientSecret: env.AUTH0_CLIENT_SECRET,
    audience: env.AUTH0_AUDIENCE
  },
  pubnub: {
    publishKey: env.PUBNUB_PUBLISH_KEY,
    subscribeKey: env.PUBNUB_SUBSCRIBE_KEY,
    secretKey: env.PUBNUB_SECRET_KEY
  },
  errorTypes: {
    db: { statusCode: 500, name: 'Internal Server Error', message: 'database error' },
    validation: { statusCode: 400, name: 'Bad Request', message: 'validation error' },
    auth: { statusCode: 401, name: 'Unauthorized', message: 'auth error' },
    forbidden: { statusCode: 403, name: 'Forbidden', message: 'forbidden content' },
    notFound: { statusCode: 404, name: 'Not Found', message: 'content not found' },
    entity: { statusCode: 422, name: 'Unprocessable Entity', message: 'entity error' }
  },
  get errorMap() {
    return {
      ValidateError: this.errorTypes.validation,
      ValidationError: this.errorTypes.validation,
      CastError: this.errorTypes.db
    };
  }
};
