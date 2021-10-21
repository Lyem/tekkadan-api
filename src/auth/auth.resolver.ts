import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import jwtDecode from 'jwt-decode';
import { CreateUserInput } from 'src/user/dto/create-user.input';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { AuthInput } from './dto/auth.input';
import { AuthType } from './dto/auth.type';
import { GqlAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private jwtStrategy: JwtStrategy
    ) {}
  
  @Mutation(() => AuthType)
  async createUser(@Args('data') data: CreateUserInput): Promise<AuthType> {
    data.nome = data.nome + '#' + await this.authService.pad((Math.random() * (9999 - 0) + 0)|0, 4)
    return this.authService.createUser(data);
  }

  @Mutation(() => AuthType)
  public async login(
    @Args('data') data: AuthInput
  ): Promise<AuthType> {
    const response = await this.authService.validateUser(data);

    return {
      token: response.token,
      user: response.user
    }
  }

  @UseGuards(GqlAuthGuard)
  @Query(()=> User)
  public async me(@Context('req') payload: string){
    var user = await this.jwtStrategy.validate(jwtDecode(payload['headers']['authorization']))
    return user
  }
}
