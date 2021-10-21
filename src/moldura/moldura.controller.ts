import { ConflictException, Controller, NotFoundException, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Image } from 'src/common/helpers/image';
import { MolduraService } from './moldura.service';
import { Request } from 'express';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { Perm } from 'src/auth/authorization.decorator';
import { AuthorizationGuard } from 'src/auth/authorization.guard';

@Controller('moldura')
export class MolduraController {
    constructor(
        private molduraservice: MolduraService,
        private image: Image,
    ){}

    @Post('/create')
    @UseInterceptors(FileInterceptor('foto'))
    @UseGuards(GqlAuthGuard)
    @Perm(3)
    @UseGuards(AuthorizationGuard)
    async createMoldura(@UploadedFile() foto: Express.Multer.File, @Req() req: Request){
        if(!req['body']['nome']){
            throw new NotFoundException('fields not found');
        }
        try {
            await this.molduraservice.createMoldura({nome:req['body']['nome'], foto: `${foto.path.slice(18)}`})
        } catch (error) {
            this.image.deleteFile(foto.path.slice(18))
            throw new ConflictException(`${req['body']['nome']} a really exists`)
        }
    }

    @Put('/update')
    @UseInterceptors(FileInterceptor('foto'))
    @UseGuards(GqlAuthGuard)
    @Perm(3)
    @UseGuards(AuthorizationGuard)
    async updateMoldura(
        @Req() req: Request,
        @UploadedFile() foto?: Express.Multer.File){
        var moldura = JSON.parse('{}')
        if(!req['body']['id']){
            throw new NotFoundException('fields not found');
        }
        if(!!req['body']['nome']){
            moldura.nome = req['body']['nome'];
        }
        if(!!foto){
            moldura.foto = foto.path.slice(18)
        }
        try {
            await this.molduraservice.updateMoldura(req['body']['id'],moldura)  
        } catch (error) {
            this.image.deleteFile(foto.path.slice(18))
            throw new NotFoundException('moldura not fould')
        }
    }
}
