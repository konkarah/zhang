const Joi = require('joi');

const memberSchema = Joi.object({
  full_name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  country: Joi.string().min(2).max(100).required(),
  membership_tier: Joi.string().valid('basic', 'premium', 'vip').required(),
  status: Joi.string().valid('active', 'inactive', 'suspended').required(),
  joined_date: Joi.date().iso().required(),
  expiry_date: Joi.date().iso().required()
});

module.exports = memberSchema;
