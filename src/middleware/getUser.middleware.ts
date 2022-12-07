import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

@Injectable()
export class GetUserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Get User Middleware`);

    const authentication = req.headers && req.headers?.authorization;
    const token = authentication?.split(' ')[1] || '';

    try {
      const result = verify(token, process.env.SECRET_KEY_JWT, {
        ignoreExpiration: false,
      }) as JwtPayload;

      req.headers.username = result?.name;
      req.headers.email = result?.email;

      console.log(`Validated user: ${result.email}`);
      next();
    } catch (error) {
      console.error(
        `Got an error trying to authenticate an user: ${error.message}`,
      );
      req.headers.username = null;
      req.headers.email = null;

      next();
    }
  }
}
