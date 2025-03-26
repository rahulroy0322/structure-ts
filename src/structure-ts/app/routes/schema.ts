import Joi from 'joi';

const methods = Joi.string()
  .valid('get', 'post', 'patch', 'put', 'delete', 'options', 'head', 'connect')
  .required();

const func = Joi.function().required();

const keyValSchema = Joi.object({
  kind: Joi.string().valid('param').required(),
  key: Joi.string().required(),
  translator: func,
});

const dynamicRoutes = Joi.array().items(
  Joi.array().ordered(
    Joi.object().pattern(Joi.string(), Joi.string()).required(),
    Joi.array().items(keyValSchema).required(),
    methods,
    func
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
    func
  )
);

const routeSchema = Joi.object({
  main: routesSchema.required(),
  dynamic: dynamicRoutes.required(),
});

export { routeSchema };
