import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken')

interface CustomRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {

  // Still have to improve this middleware to better handle errors in case there is no auth headers.

  const authHeader = req.headers['authorization'];
  const token = authHeader
  console.log('AUTHHEADER: ', authHeader)
  console.log('REQ.HEADERS: ', req.headers)
  console.log('AUTH MIDDLEWARE TOKEN: ', token)
  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'secretPass', (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
};