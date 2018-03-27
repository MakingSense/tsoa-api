import { resolve as pathResolve } from 'path';
import { config } from 'dotenv';

const { env } = process;
config({ path: pathResolve(__dirname, `./env/.env.${env.NODE_ENV}`) });

export default {
  environment: env.NODE_ENV,
  port: Number(env.PORT),
  mongoConnectionString: env.MONGO_CONNECTION_STRING,
  errorTypes: {
    db: { statusCode: 500, name: 'Internal Server Error', message: 'database error' },
    validation: { statusCode: 400, name: 'Bad Request', message: 'validation error' },
    auth: { statusCode: 401, name: 'Unauthorized', message: 'auth error' },
    forbidden: { statusCode: 403, name: 'Forbidden', message: 'forbidden content' },
    entity: { statusCode: 422, name: 'Unprocessable Entity', message: 'entity error' }
  },
  get errorMap() {
    return {
      ValidateError: this.errorTypes.validation
    }
  }
}
