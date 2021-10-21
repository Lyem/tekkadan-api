import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import jwtDecode from 'jwt-decode';
import { Image } from 'src/common/helpers/image';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Obra } from './obra.entity';

@Injectable()
export class ObraService {
    constructor(
        @InjectRepository(Obra)
        private obraRepository: Repository<Obra>,
        private userService: UserService,
        private image: Image,
       // private chapterService: ChapterService
    ) {}

    async findAllObras(): Promise<Obra[]> {
        return await this.obraRepository.find({relations:['user']});
    }

    async getObraById(id: string): Promise<Obra> {
        const obra = await this.obraRepository.findOne({id: id},{relations:['user','categorias','chapters']});
        if (!obra) {
          throw new NotFoundException('obra not found');
        }
        return obra;
    }

    async getObraByName(nome: string): Promise<Obra> {
        const obra = await this.obraRepository.findOne({nome: nome});
        if (!obra) {
          throw new NotFoundException('obra not found');
        }
        return obra;
    }

    async createObra(token: string,data: {nome: string, autor?: [],artista?: [], sinopse?:string ,ondeoanimeparou?: string, categorias?: []}): Promise<Obra> {
        const obra = this.obraRepository.create(data);
        const user = await this.userService.getUserById(jwtDecode(token)['sub']);
        obra.user = user;
        return this.obraRepository.save(obra);
    }

    async updateObra(id: string, data: {nome?: string, autor?: [],artista?: [] ,capa?: string, fundo?: string, sinopse?:string ,ondeoanimeparou?: string, categorias?: []}): Promise<Obra> {
        const obra = await this.getObraById(id);
        return this.obraRepository.save({ ...obra, ...data });
    }

    async deleteObra(id: string): Promise<Boolean>{
        this.obraRepository.delete(id)
        this.image.deleteFolder(`obras/${id}`)
        return true
    }
}
