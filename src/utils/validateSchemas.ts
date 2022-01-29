import userInterface from '../interfaces/user.interface';
import * as yup from 'yup';

const dateParamsSelfSchema = {
  date: {
    unixtimeStampInputType: '^[0-9]+$',
    dateStringInputType: '^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$',
    emptyInputType: '^$'
  }
};
const userBodySchema = yup.object().shape({
  username: yup.string().required(),
  _id: yup.string()
});

const exerciseBodySchema = yup.object().shape({
  duration: yup.number().required().positive(),
  description: yup.string().required(),
  date: yup.date().default(() => new Date())
});
const exerciseParamsSchema = yup.object().shape({
  from: yup.string().matches(new RegExp('^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$')),
  to: yup.string().matches(new RegExp('^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$')),
  limit: yup.string().matches(new RegExp('^[0-9]+$'))
});

const dateParamsSchema = yup.object({
  // date: string().oneOf([matches(new RegExp('^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$')]) // TODO fix multi regex
});

const urlBodySchema = yup.object().shape({
  url: yup.string().url('invalid url').required()
});

export default { userBodySchema, exerciseBodySchema, exerciseParamsSchema, dateParamsSchema, urlBodySchema };
