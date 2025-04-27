const Joi = require('joi');

const envSchema = Joi.object({
  MONGODB_URI: Joi.string().uri().required(),
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().valid('dev', 'prod').default('dev')
}).unknown();

function validateEnv() {
  const { error } = envSchema.validate(process.env);
  if (error) {
    console.error('Environment validation error:', error.message);
    process.exit(1);
  }
}

module.exports = validateEnv;
