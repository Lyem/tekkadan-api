import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ObraModule } from './obra/obra.module';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { MolduraModule } from './moldura/moldura.module';
import { CategoryModule } from './category/category.module';
import { AuthorsModule } from './authors/authors.module';
import { ChapterModule } from './chapter/chapter.module';
import { PagesModule } from './pages/pages.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    UserModule,
    AuthModule,
    ObraModule,
    MolduraModule,
    CategoryModule,
    AuthorsModule,
    ChapterModule,
    PagesModule,
  ],
})
export class AppModule {}
