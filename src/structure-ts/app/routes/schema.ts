import Joi from 'joi';

import { VALID_TYPES } from '../../constents';

const methods = Joi.string()
  .valid('get', 'post', 'patch', 'put', 'delete', 'options', 'head', 'connect')
  .required();

const func = Joi.function().required();

const keyValSchema = Joi.object({
  kind: Joi.string().valid('param').required(),
  key: Joi.string().required(),
  translator: func,
});

const bodySchema = Joi.alternatives(
  Joi.object()
    .pattern(
      Joi.string().required(),
      Joi.object({
        type: Joi.string()
          .valid(...VALID_TYPES)
          .required(),
        required: Joi.boolean().optional(),
      }).required()
    )
    .required(),
  Joi.allow(null).required()
).required();

const dynamicRoutes = Joi.array().items(
  Joi.array().ordered(
    Joi.object().pattern(Joi.string(), Joi.string()).required(),
    Joi.array().items(keyValSchema).required(),
    methods,
    func,
    Joi.object({
      body: bodySchema,
    }).required()
  )
);

const routesSchema = Joi.object().pattern(
  Joi.string(),
  Joi.object().pattern(
    Joi.string()
      .valid(
        'get',
        'post',
        'patch',
        'put',
        'delete',
        'options',
        'head',
        'connect'
      )
      .required(),
    {
      controller: func,
      body: bodySchema,
    }
  )
);

const routeSchema = Joi.object({
  main: routesSchema.required(),
  dynamic: dynamicRoutes.required(),
});

export { routeSchema };
