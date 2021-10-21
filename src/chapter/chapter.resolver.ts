import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Perm } from 'src/auth/authorization.decorator';
import { AuthorizationGuard } from 'src/auth/authorization.guard';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { Chapter } from './chapter.entity';
import { ChapterService } from './chapter.service';

@Resolver('chapter')
export class ChapterResolver {
    constructor(
        private chapterService: ChapterService
    ){}

    @Query(()=>Chapter)
    async chapter(@Args('id') id: string): Promise<Chapter> {      
      return this.chapterService.getChapterByid(id)
    }

    @UseGuards(GqlAuthGuard)
    @Perm(2)
    @UseGuards(AuthorizationGuard)
    @Mutation(() => Boolean)
    async deleteChapter(
        @Args('id') id: string,): Promise<Boolean> {
            let chapter = await this.chapterService.getChapterByid(id)
            for (let x = 0; x < chapter.pages.length; x++) {
              this.chapterService.deletepage(chapter.pages[x].id)
            }
      return this.chapterService.deletechapter(chapter.id);
    }
}
