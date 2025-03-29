import Joi from 'joi';

import { FIELDS_TYPE } from '../constants/types';

const strSchema = Joi.string();
const bool = Joi.boolean();

const schemaSchema = Joi.object()
  .pattern(
    strSchema.required(),
    Joi.alternatives(
      strSchema.valid(...FIELDS_TYPE).required(),
      Joi.object({
        type: strSchema.required(),
        required: bool.optional(),
        unique: bool.optional(),
        default: Joi.any().optional(),
      })
    )
  )
  .required();

export { schemaSchema, strSchema };
