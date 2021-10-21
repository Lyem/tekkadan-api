import { Controller, NotFoundException, Post, Req, UnsupportedMediaTypeException, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { Request } from 'express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Image } from 'src/common/helpers/image';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthorizationGuard } from 'src/auth/authorization.guard';
import { Perm } from 'src/auth/authorization.decorator';

@Controller('chapter')
export class ChapterController {
    constructor(
        private chapterService: ChapterService,
        private image: Image
    ) {}
    
    @UseGuards(GqlAuthGuard)
    @Perm(2)
    @UseGuards(AuthorizationGuard)
    @Post('/create')
    @UseInterceptors(AnyFilesInterceptor())
    async createchapter(@UploadedFiles() files: Array<Express.Multer.File>, @Req() req: Request) {
        if(!req['body']['numero']){
            throw new NotFoundException('numero not found');
        }
        if(!req['body']['obraid']){
            throw new NotFoundException('obraid not found');
        }
        if(files.length == 0){
            throw new NotFoundException('files not found');
        }
        var dot = ""
        var numero = req['body']['numero']
        if(numero.indexOf(".") != -1){
            var split = numero.split('.')
            numero = split[0]
            dot = "." + parseInt(split[1]).toString()
            if(!parseInt(split[1])){
                throw new UnsupportedMediaTypeException('numero is an Number!!')
            }
        }
        if(!parseInt(numero) && numero != '0'){
            throw new UnsupportedMediaTypeException('numero is an Number!!')
        }
        const chapter = await this.chapterService.createChapter(req['body']['obraid'],await this.chapterService.pad(numero,2) + dot,req['headers']['authorization'],req['body']['titulo'])
        for (let index = 0; index < files.length; index++) {
            await this.image.saveAndConverterImages(files[index].buffer,`${await this.chapterService.pad(index,4)}`,`obras/${chapter.obra.id}/${chapter.id}`)
            this.chapterService.createPage(chapter.id,`obras/${chapter.obra.id}/${chapter.id}/${await this.chapterService.pad(index,4)}.webp`)
        }
        return await this.chapterService.pad(numero,2) + dot
    }
}
