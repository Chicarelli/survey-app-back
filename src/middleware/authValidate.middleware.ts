import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthValidateMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authentication = req.headers && req.headers?.authorization;
    const token = authentication.split(' ')[1];

    try {
      const result = verify(token, process.env.SECRET_KEY_JWT, {
        ignoreExpiration: false,
      }) as JwtPayload;

      req.headers.username = result?.name;
      req.headers.email = result?.email;

      next();
    } catch (error) {
      console.error(
        `Got an error trying to authenticate an user: ${error.message}`,
      );
      return res.status(401).send({ message: 'Unauthenticated User' });
    }
  }
}
