import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Perm } from 'src/auth/authorization.decorator';
import { AuthorizationGuard } from 'src/auth/authorization.guard';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

@Resolver('category')
export class CategoryResolver {
    constructor(
        private categoryService: CategoryService
    ) {}
    
    @UseGuards(GqlAuthGuard)
    @Perm(2)
    @UseGuards(AuthorizationGuard)
    @Mutation(()=>Category)
    async createCategory(@Args('nome') nome: string): Promise<Category>{
        return await this.categoryService.createCategory({nome: nome})
    }

    @UseGuards(GqlAuthGuard)
    @Perm(2)
    @UseGuards(AuthorizationGuard)
    @Mutation(()=>Category)
    async updateCategory(@Args('id') id: string, @Args('nome') nome: string): Promise<Category>{
        return await this.categoryService.updateCategory(id,{nome: nome})
    }

    @UseGuards(GqlAuthGuard)
    @Perm(2)
    @UseGuards(AuthorizationGuard)
    @Mutation(()=>Boolean)
    async deleteCategory(@Args('id') id: string): Promise<Boolean>{
        return await this.categoryService.deleteCategory(id)
    }
}
