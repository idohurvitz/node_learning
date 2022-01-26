import config from 'config';
import userInterface from '../interfaces/user.interface';
import { object, string, number, date, AnyObjectSchema, ObjectSchema, SchemaOf } from 'yup';
interface SchemaInterface {
  [key: string]: any;
}
// TODO change the inputType to array and then add few regex ( for parsing every date string)
const schema: SchemaInterface = {
  date: {
    unixtimeStampInputType: '^[0-9]+$',
    dateStringInputType: '^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$',
    emptyInputType: '^$'
  }
};

// export default schema;

// export const Schemas: Object = {
//   userBodySchema: object().shape({
//     username: string().required()
//   }),
//   exerciseBodySchema: object().shape({
//     duration: number().required().positive().integer(),
//     description: string().required(),
//     date: date().default(() => new Date())
//   }),
//   exerciseParamsSchema: object().shape({
//     from: string().matches(new RegExp('^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$')),
//     to: string().matches(new RegExp('^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$')),
//     limit: number()
//   })
// };

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

export default { userBodySchema, exerciseBodySchema, exerciseParamsSchema };
