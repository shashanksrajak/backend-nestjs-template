import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { jwtConstants } from './constants';
import { Request } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schema/user.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //  ----  This is valid for REST ----
    // const request = context.switchToHttp().getRequest();

    const ctx = GqlExecutionContext.create(context);

    const ctxValue = ctx.getContext();
    // console.log(ctxValue.headers);

    const token = this.extractTokenFromHeader(ctxValue);
    console.log(token);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      //   const payload = await this.jwtService.verifyAsync(token, {
      //     secret: jwtConstants.secret,
      //   });

      const payload = await this.jwtService.decode(token);
      console.log(payload);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      // we fetch the user and other required info from database and attach it to request

      const user = await this.userModel.findById(payload.sub);

      ctxValue['user'] = user;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
    // console.log('print ctx', ctx);
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
