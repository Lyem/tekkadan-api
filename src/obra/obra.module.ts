import { Module } from '@nestjs/common';
import { ObraService } from './obra.service';
import { ObraResolver } from './obra.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Obra } from './obra.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { ObraController } from './obra.controller';
import { MulterModule } from '@nestjs/platform-express/multer/multer.module';
import { Image } from 'src/common/helpers/image';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/category.entity';
import { Author } from 'src/authors/authors.entity';
import { AuthorsService } from 'src/authors/authors.service';
import { Chapter } from 'src/chapter/chapter.entity';
import { Page } from 'src/pages/pages.entity';
import { ChapterService } from 'src/chapter/chapter.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Obra, User, Category, Author, Chapter, Page]),
    MulterModule.registerAsync({
      useFactory: () => ({
      limits: {
        fileSize: 100 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        const allowedMimes = [
          'image/png',
          'image/jpeg',
          'image/jpg'
        ];

        if(allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        }else {
          cb(new Error("Invalid file type."),null);
        }
      }})
    })
  ],
  providers: [ObraService, ObraResolver, UserService, Image, CategoryService, AuthorsService, ChapterService],
  controllers: [ObraController]
})
export class ObraModule {}
