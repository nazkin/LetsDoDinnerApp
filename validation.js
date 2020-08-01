const { validate, Joi } = require('express-validation');

const signUpValidation = {
    body: Joi.object({
      name: Joi.string()
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .required(),
    }),
  }
const logInValidation = {
    body: Joi.object({
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string()
          .min(6)
          .required(),
      }),
}

module.exports = {
    signUpValidation,
    logInValidation
}