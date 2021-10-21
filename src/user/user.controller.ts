import { Controller, Put, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer';
import jwtDecode from 'jwt-decode';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { Image } from 'src/common/helpers/image';
import { UserService } from './user.service';
import { Request } from 'express';

@Controller('user')
export class UserController {
    constructor(
        private obraService: UserService,
        private image: Image,
    ){}

    @Put('/update')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'foto', maxCount: 1 },
        { name: 'fundo', maxCount: 1 },
      ]))
    @UseGuards(GqlAuthGuard)
    async UpdateUser(@UploadedFiles() files: { foto?: Express.Multer.File[], fundo?: Express.Multer.File[] }, @Req() req: Request){
        const id = jwtDecode(req['headers']['authorization'])
        var uservalues = JSON.parse('{}')
        if(!!req['body']['nome']){
            uservalues.nome = req['body']['nome']
        }
        if(!!req['body']['descricao']){
            uservalues.descricao = req['body']['descricao']
        }
        if(!!req['body']['senha']){
            uservalues.senha = req['body']['senha']
        }
        if(!!req['body']['email']){
            uservalues.email = req['body']['email']
        }
        if(!!files.foto){
            this.image.saveAndConverterImages(files.foto[0].buffer,'foto',`users/${id['sub']}`)
            uservalues.foto = `users/${id['sub']}/foto.webp`
        }
        if(!!files.fundo){
            this.image.saveAndConverterImages(files.fundo[0].buffer,'fundo',`users/${id['sub']}`)
            uservalues.fundo = `users/${id['sub']}/fundo.webp`
        }
        await this.obraService.updateUser(id['sub'],uservalues)
    }
}
