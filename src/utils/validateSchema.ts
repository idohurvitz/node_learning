import config from 'config';

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

export default schema;
