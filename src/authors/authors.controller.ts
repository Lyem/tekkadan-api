import { Controller, NotFoundException, Post, Put, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor} from '@nestjs/platform-express';
import { Request } from 'express';
import { Perm } from 'src/auth/authorization.decorator';
import { AuthorizationGuard } from 'src/auth/authorization.guard';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { Image } from 'src/common/helpers/image';
import { AuthorsService } from './authors.service';

@Controller('authors')
export class AuthorsController {
    constructor(
        private authorsService: AuthorsService,
        private image: Image,
    ){}

    @Post('/create')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'foto', maxCount: 1 },
      ]))
    @UseGuards(GqlAuthGuard)
    @Perm(2)
    @UseGuards(AuthorizationGuard)
    async createAuthor(@Req() req: Request,@UploadedFiles() file: { foto?: Express.Multer.File[] }) {
        if(!req['body']['nome']){
            throw new NotFoundException('nome not found');
        }
        try {
            var author = await this.authorsService.createAuthor({nome: req['body']['nome']})
        } catch (error) {
            return error
        }
        if(!!file.foto){
            try {
                this.image.saveAndConverterImages(file.foto[0].buffer,'foto',`authors/${author.id}/`)
                author = await this.authorsService.updateAuthor(author.id,{foto: `authors/${author.id}/foto.webp`})
            } catch (error) {
                return error
            }
        }
        return author
    }

    @Put('/update')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'foto', maxCount: 1 },
      ]))
    @UseGuards(GqlAuthGuard)
    @Perm(2)
    @UseGuards(AuthorizationGuard)
    async UpdateAuthor(@Req() req: Request,@UploadedFiles() file: { foto?: Express.Multer.File[] }) {
        var author = JSON.parse('{}')
        if(!req['body']['id']){
            throw new NotFoundException('id not found');
        }
        if(!!req['body']['nome']){
            author.nome = req['body']['nome']
        }
        if(!!file.foto){
            this.image.saveAndConverterImages(file.foto[0].buffer,'foto',`authors/${req['body']['id']}/`)
            author.foto = `authors/${req['body']['id']}/foto.webp`
        }
        return await this.authorsService.updateAuthor(req['body']['id'],author)
    }
}
