import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Category } from './category.entity';
import { UserService } from 'src/user/user.service';
import { Image } from 'src/common/helpers/image';

@Module({
  imports:[
    TypeOrmModule.forFeature([Category, User]),
  ],
  providers: [CategoryService, CategoryResolver,UserService, Image]
})
export class CategoryModule {}
