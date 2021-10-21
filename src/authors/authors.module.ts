import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsResolver } from './authors.resolver';
import { AuthorsController } from './authors.controller';
import { Author } from './authors.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Image } from 'src/common/helpers/image';
import { User } from 'src/user/user.entity';
import { MulterModule } from '@nestjs/platform-express/multer/multer.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Author, User]),
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
  providers: [AuthorsService, AuthorsResolver,UserService, Image],
  controllers: [AuthorsController]
})
export class AuthorsModule {}
