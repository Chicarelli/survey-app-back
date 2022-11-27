import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthValidateMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { username, email } = req.headers;

    if (!username || !email) {
      return res.status(401).send({ message: 'Unauthenticated User' });
    }

    next();
  }
}
