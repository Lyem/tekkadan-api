import { Controller, NotFoundException, Post, Put, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor} from '@nestjs/platform-express/multer';
import { ObraService } from './obra.service';
import { Request } from 'express';
import { Perm } from 'src/auth/authorization.decorator';
import { Image } from 'src/common/helpers/image'
import { AuthorizationGuard } from 'src/auth/authorization.guard';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { CategoryService } from 'src/category/category.service';
import { AuthorsService } from 'src/authors/authors.service';

@Controller('obra')
export class ObraController {
    constructor(
        private obraService: ObraService,
        private image: Image,
        private categoryService: CategoryService,
        private authorsService: AuthorsService
    ){}
      
  @Post('/create')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'capa', maxCount: 1 },
    { name: 'fundo', maxCount: 1 },
  ]))
  @UseGuards(GqlAuthGuard)
  @Perm(2)
  @UseGuards(AuthorizationGuard)
  async createObra(@UploadedFiles() files: { capa: Express.Multer.File[], fundo?: Express.Multer.File[] }, @Req() req: Request) {
    if(!req['body']['nome']){
      throw new NotFoundException('nome not found');
    }
    if(!files.capa){
      throw new NotFoundException('capa not found');
    }
    var obrafiles = JSON.parse('{}')
    var obra = await this.obraService.createObra(req['headers']['authorization'] ,await this.getObraValues(req))
    
    this.image.saveAndConverterImages(files.capa[0].buffer,'capa',`obras/${obra.id}`)
    obrafiles.capa = `obras/${obra.id}/capa.webp`
    if(!!files.fundo){
      this.image.saveAndConverterImages(files.fundo[0].buffer,'fundo',`obras/${obra.id}`)
      obrafiles.fundo = `obras/${obra.id}/fundo.webp`
    }
    
    obra = await this.obraService.updateObra(obra.id,obrafiles)

    return {'id': obra.id}
  }

  @Put('/update')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'capa', maxCount: 1 },
    { name: 'fundo', maxCount: 1 },
  ]))
  @UseGuards(GqlAuthGuard)
  @Perm(2)
  @UseGuards(AuthorizationGuard)
  async updateObra(@UploadedFiles() files: { capa: Express.Multer.File[], fundo?: Express.Multer.File[] }, @Req() req: Request) {
    if(!req['body']['id']){
      throw new NotFoundException('id not found');
    }
    var obravalues = await this.getObraValues(req)
    if(!!files.capa){
      this.image.saveAndConverterImages(files.capa[0].buffer,'capa',`obras/${req['body']['id']}`)
      obravalues.capa = `obras/${req['body']['id']}/capa.webp`
    }
    if(!!files.fundo){
      this.image.saveAndConverterImages(files.fundo[0].buffer,'fundo',`obras/${req['body']['id']}`)
      obravalues.fundo = `obras/${req['body']['id']}/fundo.webp`
    }
    const obra = await this.obraService.updateObra(req['body']['id'],obravalues)

    return {'id': obra.id}
  }


  private async getObraValues(req: Request): Promise<any>{
    
    var obra = JSON.parse('{}')

    if(!!req['body']['nome']){
      obra.nome = req['body']['nome']
    }

    if(!!req['body']['sinopse']){
      obra.sinopse = req['body']['sinopse']
    }

    if(!!req['body']['artista']){
      var artistas = []
      var artista = req['body']['artista']
      artista = artista.split(',')
      for (let index = 0; index < artista.length; index++) {
        artistas.push(await this.authorsService.getAuthorById(artista[index]))
      }
      obra.artista = artistas
    }

    if(!!req['body']['autor']){
      var autors = []
      var autor = req['body']['artista']
      autor = autor.split(',')
      for (let index = 0; index < autor.length; index++) {
        autors.push(await this.authorsService.getAuthorById(autor[index]))
      }
      obra.autor = autors
    }
    
    if(!!req['body']['ondeoanimeparou']){
      obra.ondeoanimeparou = req['body']['ondeoanimeparou']
    }

    if(!!req['body']['categorias']){
      var categorias = []
      var categorys = req['body']['categorias']
      categorys = categorys.split(',')
      for (let index = 0; index < categorys.length; index++) {
        categorias.push(await this.categoryService.getCategoryById(categorys[index]))
      }
      obra.categorias = categorias
    }

    return obra
  }

}
