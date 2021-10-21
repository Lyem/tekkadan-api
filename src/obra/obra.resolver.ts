import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Perm } from 'src/auth/authorization.decorator';
import { AuthorizationGuard } from 'src/auth/authorization.guard';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { ChapterService } from 'src/chapter/chapter.service';
import { Obra } from './obra.entity';
import { ObraService } from './obra.service';

@Resolver('Obra')
export class ObraResolver {
    constructor(
        private obraService: ObraService,
        private chapterService: ChapterService
    ){}

    @Query(() => Obra)
    async obra(@Args('id') id: string): Promise<Obra> {      
      return this.obraService.getObraById(id)
    }

    @Query(() => [Obra])
    async obras(): Promise<Obra[]> {      
      return this.obraService.findAllObras()
    }

    @UseGuards(GqlAuthGuard)
    @Perm(2)
    @UseGuards(AuthorizationGuard)
    @Mutation(() => Boolean)
    async deleteObra(
        @Args('id') id: string,): Promise<Boolean> {
          const obra = await this.obraService.getObraById(id)
          for (let index = 0; index < obra.chapters.length; index++) {
            let chapter = await this.chapterService.getChapterByid(obra.chapters[index].id)
            for (let x = 0; x < chapter.pages.length; x++) {
              this.chapterService.deletepage(chapter.pages[x].id)
            }
            this.chapterService.deletechapter(obra.chapters[index].id)
          }
      return this.obraService.deleteObra(id);
    }
}
