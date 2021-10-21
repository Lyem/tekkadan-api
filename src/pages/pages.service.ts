import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chapter } from 'src/chapter/chapter.entity';
import { Repository } from 'typeorm';
import { Page } from './pages.entity';

@Injectable()
export class PagesService {
    constructor(
        @InjectRepository(Chapter)
        private chapterRepository: Repository<Chapter>,
        @InjectRepository(Page)
        private pageRepository: Repository<Page>
    ) {}

}
