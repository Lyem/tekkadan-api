import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.entity';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import jwtDecode from 'jwt-decode';
import { Perm } from 'src/auth/authorization.decorator';
import { AuthorizationGuard } from 'src/auth/authorization.guard';
import { Image } from 'src/common/helpers/image';

@Resolver('User')
export class UserResolver {
    constructor(
        private userService: UserService,
        private image: Image,
    ){}

    @Query(() => User)
    async user(@Args('id') id: string): Promise<User> {
      return this.userService.getUserById(id);
    }
    
    @UseGuards(GqlAuthGuard)
    @Perm(3)
    @Query(() => User)
    async userByName(@Args('name') name: string): Promise<User> {
      return this.userService.getUserByName(name);
    }
    
    @UseGuards(GqlAuthGuard)
    @Perm(3)
    @Query(() => [User])
    async users(): Promise<User[]> {
      return await this.userService.findAllUsers();
    }
    
    @UseGuards(GqlAuthGuard)
    @Mutation(() => User)
    async defaultUserPhotos(
      @Context('req') payload: string,
      @Args('foto') foto: boolean,
      @Args('fundo') fundo: boolean,
    ): Promise<User> {
      const id = jwtDecode(payload['headers']['authorization'])
      var uservalues = JSON.parse('{}')
      if(foto){
        await this.image.deleteFile(`users/${id['sub']}/foto.webp`)
        uservalues.foto = 'images/fotopadrao.webp'
      }
      if(fundo){
        await this.image.deleteFile(`users/${id['sub']}/fundo.webp`)
        uservalues.fundo = 'images/fundopadrao.webp'
      }
      return this.userService.updateUser(id['sub'], uservalues);
    }

    @UseGuards(GqlAuthGuard)
    @Perm(3)
    @UseGuards(AuthorizationGuard)
    @Mutation(() => User)
    async updateuserperm(
      @Args('permissao') permissao: number,
      @Args('user') user: string,
      @Context('req') payload: string
    ): Promise<User> {
      const u = await this.userService.getUserById(user)
      return this.userService.updateUserPerm(payload['headers']['authorization'],permissao,u);
    }

    @UseGuards(GqlAuthGuard)
    @Perm(1)
    @UseGuards(AuthorizationGuard)
    @Mutation(() => User)
    async updateUserTag(
      @Args('name') name: string,
      @Context('req') payload: string
    ): Promise<User>{
      const id = jwtDecode(payload['headers']['authorization'])['sub']
      return await this.userService.updateUserTag(id,name)
    }

    @UseGuards(GqlAuthGuard)
    @Perm(4)
    @UseGuards(AuthorizationGuard)
    @Mutation(() => User)
    async passtheowner(
      @Args('user') user: string,
      @Context('req') payload: string
    ): Promise<User> {
      const u = await this.userService.getUserById(user)
      return this.userService.passtheowner(payload['headers']['authorization'],u);
    }
}
