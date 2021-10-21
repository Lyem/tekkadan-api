import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Perm } from 'src/auth/authorization.decorator';
import { AuthorizationGuard } from 'src/auth/authorization.guard';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { Author } from './authors.entity';
import { AuthorsService } from './authors.service';

@Resolver()
export class AuthorsResolver {
    constructor(
        private authorsService: AuthorsService
    ) {}

    @Query(() => Author)
    async author(@Args('id') id: string): Promise<Author> {      
      return this.authorsService.getAuthorById(id)
    }

    @Query(()=>[Author])
    async authors(): Promise<Author[]>{
        return await this.authorsService.findAllAuthors()
    }

    @UseGuards(GqlAuthGuard)
    @Perm(2)
    @UseGuards(AuthorizationGuard)
    @Mutation(()=>Boolean)
    async deleteAuthor(@Args('id') id: string): Promise<Boolean>{
        return await this.authorsService.deleteAuthor(id)
    }
}
