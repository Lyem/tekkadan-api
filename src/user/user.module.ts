import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { Image } from 'src/common/helpers/image';
import { MulterModule } from '@nestjs/platform-express/multer/multer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
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
  providers: [UserService, UserResolver, Image],
  controllers: [UserController]
})
export class UserModule {}
