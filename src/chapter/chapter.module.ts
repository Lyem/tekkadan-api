import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterResolver } from './chapter.resolver';
import { ChapterController } from './chapter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from 'src/pages/pages.entity';
import { Chapter } from './chapter.entity';
import { Obra } from 'src/obra/obra.entity';
import { MulterModule } from '@nestjs/platform-express/multer/multer.module';
import { ObraService } from 'src/obra/obra.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { Image } from 'src/common/helpers/image';

@Module({
  imports: [
    TypeOrmModule.forFeature([Page, Chapter, Obra, User]),
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
  providers: [ChapterService, ChapterResolver, ObraService, UserService, Image],
  controllers: [ChapterController]
})
export class ChapterModule {}
