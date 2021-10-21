import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './pages.entity';
import { PagesService } from './pages.service';
import { PagesResolver } from './pages.resolver';
import { Chapter } from 'src/chapter/chapter.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Page, Chapter]),
    ],
    providers: [PagesService, PagesResolver]
})
export class PagesModule {}
