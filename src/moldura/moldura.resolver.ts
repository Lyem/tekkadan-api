import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import jwtDecode from 'jwt-decode';
import { Perm } from 'src/auth/authorization.decorator';
import { AuthorizationGuard } from 'src/auth/authorization.guard';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { Moldura } from './moldura.entity';
import { MolduraService } from './moldura.service';

@Resolver('Moldura')
export class MolduraResolver {
    constructor(
        private molduraService: MolduraService,
        private userService: UserService
    ){}

    @UseGuards(GqlAuthGuard)
    @Perm(3)
    @UseGuards(AuthorizationGuard)
    @Mutation(()=> Boolean)
    async giveMoldura(@Args('userid') userid: string,@Args('molduraid') molduraid: string): Promise<Boolean> {
      const moldura = await this.molduraService.getMolduraById(molduraid)
      this.userService.giveMoldura(userid,moldura)
      return true
    }

    @UseGuards(GqlAuthGuard)
    @Perm(3)
    @UseGuards(AuthorizationGuard)
    @Mutation(()=> Boolean)
    async throwMoldura(@Args('userid') userid: string,@Args('molduraid') molduraid: string): Promise<Boolean> {
      const moldura = await this.molduraService.getMolduraById(molduraid)
      this.userService.throwMoldura(userid,moldura)
      return true
    }

    @UseGuards(GqlAuthGuard)
    @Perm(0)
    @UseGuards(AuthorizationGuard)
    @Mutation(()=> Boolean)
    async selectMoldura(@Context('req') payload: string,@Args('molduraid') molduraid: string): Promise<Boolean> {
      const id = jwtDecode(payload['headers']['authorization'])
      const moldura = await this.molduraService.getMolduraById(molduraid)
      this.userService.selectMoldura(id['sub'],moldura)
      return true
    }

    @UseGuards(GqlAuthGuard)
    @Perm(0)
    @UseGuards(AuthorizationGuard)
    @Mutation(()=> Boolean)
    async resetMoldura(@Context('req') payload: string): Promise<Boolean> {
      const id = jwtDecode(payload['headers']['authorization'])
      this.userService.reseteMoldura(id['sub'])
      return true
    }

    @UseGuards(GqlAuthGuard)
    @Perm(3)
    @UseGuards(AuthorizationGuard)
    @Mutation(()=> Boolean)
    async deleteMoldura(@Args('id') id: string): Promise<Boolean> {
      this.deleteMoldura(id);
      return true
    }
    
    @UseGuards(GqlAuthGuard)
    @Perm(3)
    @UseGuards(AuthorizationGuard)
    @Query(() => Moldura)
    async moldura(@Args('id') id: string): Promise<Moldura> {
      return this.molduraService.getMolduraById(id);
    }
    
    @UseGuards(GqlAuthGuard)
    @Perm(3)
    @UseGuards(AuthorizationGuard)
    @Query(() => Moldura)
    async molduraByName(@Args('nome') nome: string): Promise<Moldura> {
      return this.molduraService.getMolduraByNome(nome);
    }
    
    @UseGuards(GqlAuthGuard)
    @Perm(3)
    @UseGuards(AuthorizationGuard)
    @Query(() => [Moldura])
    async molduras(): Promise<Moldura[]> {
      return await this.molduraService.findAllMolduras();
    }
}
