import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import jwtDecode from 'jwt-decode';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
      private reflector: Reflector,
      private userService: UserService
    ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const perm = this.reflector.get<number>('perm', context.getHandler());
    const ctx = GqlExecutionContext.create(context);
    var user
    if(!!ctx.getContext().req){
      user = await this.userService.getUserById(jwtDecode(ctx.getContext().req.headers.authorization)['sub'])
    }else{
      user = await this.userService.getUserById(jwtDecode(context.switchToHttp().getResponse().req.headers.authorization)['sub'])
    }
    if(user.permissao < perm){
      throw new UnauthorizedException('Unauthorized');
    }
    return true
  }
}
