import userInterface from '../interfaces/user.interface';
import { object, string, number, date, AnyObjectSchema, ObjectSchema, SchemaOf } from 'yup';

const dateParamsSelfSchema = {
  date: {
    unixtimeStampInputType: '^[0-9]+$',
    dateStringInputType: '^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$',
    emptyInputType: '^$'
  }
};
const userBodySchema: SchemaOf<userInterface> = object({
  username: string().required(),
  _id: string()
});

const exerciseBodySchema = object({
  duration: number().required().positive().integer(),
  description: string().required(),
  date: date().default(() => new Date())
});
const exerciseParamsSchema = object({
  from: string().matches(new RegExp('^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$')),
  to: string().matches(new RegExp('^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$')),
  limit: number()
});

const dateParamsSchema = object({
  // date: string().oneOf([matches(new RegExp('^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$')]) // TODO fix multi regex
});

const urlBodySchema = object().shape({
  url: string().url('invalid url').required()
});

export default { userBodySchema, exerciseBodySchema, exerciseParamsSchema, dateParamsSchema, urlBodySchema };
