const mongoUserName: string = 'admin';
const mongoUserPassword: string = 'Password1';

export default {
  port: 3000,
  unknownCurrentUserInputType: 'Unknown User Input Type',
  unixtimeStampInputType: 'unixtimeStampInputType',
  dateStringInputType: 'dateStringInputType',
  emptyInputType: 'emptyInputType',
  invalidDateError: 'Invalid Date',
  dbUri: `mongodb+srv://${mongoUserName}:${mongoUserPassword}@node-learning.hopqk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
};
