import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import jwtDecode from 'jwt-decode';
import { ObraService } from 'src/obra/obra.service';
import { Page } from 'src/pages/pages.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Chapter } from './chapter.entity';

@Injectable()
export class ChapterService {
    constructor(
        @InjectRepository(Chapter)
        private chapterRepository: Repository<Chapter>,
        @InjectRepository(Page)
        private pageRepository: Repository<Page>,
        private obraService: ObraService,
        private userService: UserService
    ) {}

    async pad(number:number, length:number): Promise<string> {
        var str = '' + number;
        while (str.length < length) {
          str = '0' + str;
        }
        return str;
    }

    async getChapterByid(id: string): Promise<Chapter>{
        const chapter = await this.chapterRepository.findOne({id: id},{relations: ['pages']})
        if(!chapter){
            throw new NotFoundException('chapter not found')
        }
        return chapter
    }

    async getPageByid(id: string): Promise<Page>{
        const page = await this.pageRepository.findOne({id: id})
        if(!page){
            throw new NotFoundException('page not found')
        }
        return page
    }

    async createChapter(obraid: string, numero: string,token: string, titulo?: string): Promise<Chapter>{
        const obra = await this.obraService.getObraById(obraid)
        const user = await this.userService.getUserById(jwtDecode(token)['sub']);
        for (let index = 0; index < obra.chapters.length; index++) {
            if(obra.chapters[index].numero == numero){
                throw new ConflictException('chapter already exists')
            }
        }
        const chapter = this.chapterRepository.create({numero: numero, titulo: titulo, obra: obra, user: user})
        return await this.chapterRepository.save(chapter)
    }

    async createPage(chapterid: string, link: string): Promise<Page>{
        const chapter = await this.getChapterByid(chapterid)
        const page = this.pageRepository.create({page: link, chapter: chapter})
        return await this.pageRepository.save(page)
    }

    async deletechapter(id: string): Promise<Boolean>{
        this.chapterRepository.delete(id)
        return true
    }

    async deletepage(id: string): Promise<Boolean>{
        const page = await this.getPageByid(id)
        this.pageRepository.remove(page)
        return true
    }
}
