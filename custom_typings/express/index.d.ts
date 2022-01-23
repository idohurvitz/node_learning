declare namespace Express {
  interface Request {
    CurrentUserInputType: string;
    CurrentUserObject: { _id: string; username: string };
  }
}
