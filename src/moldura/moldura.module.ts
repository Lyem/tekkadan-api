import { Module } from '@nestjs/common';
import { MolduraController } from './moldura.controller';
import { MolduraService } from './moldura.service';
import { MolduraResolver } from './moldura.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Image } from 'src/common/helpers/image';
import { MulterModule } from '@nestjs/platform-express/multer/multer.module';
import { Moldura } from './moldura.entity';
import { UserService } from 'src/user/user.service';
import { resolve } from 'path';
import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';

@Module({
  imports: [
    TypeOrmModule.forFeature([Moldura, User]),
    MulterModule.registerAsync({
      useFactory: () => ({
      limits: {
        fileSize: 100 * 1024 * 1024,
      },
      dest: resolve('uploads/molduras'),
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, resolve('uploads/molduras'))
        },
        filename: (req, file, cb) => {
          randomBytes(16, (err, hash) => {
            if(err) cb(err,null);
            const filename = `${hash.toString("hex")}-${file.originalname}`
            cb(null,filename)
          })
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimes = [
          'image/webp',
          'image/png',
        ];

        if(allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        }else {
          cb(new Error("Invalid file type."),null);
        }
      }})
    })
  ],
  controllers: [MolduraController],
  providers: [MolduraService, MolduraResolver, Image, UserService]
})
export class MolduraModule {}
