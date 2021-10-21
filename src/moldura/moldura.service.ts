import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from 'src/common/helpers/image';
import { Repository } from 'typeorm';
import { Moldura } from './moldura.entity';

@Injectable()
export class MolduraService {
    constructor(
        @InjectRepository(Moldura)
        private MolduraRespository: Repository<Moldura>,
        private image: Image
    ) {}

    async getMolduraById(id: string): Promise<Moldura> {
        const moldura = await this.MolduraRespository.findOne({id: id});
        if (!moldura) {
          throw new NotFoundException('moldura not found');
        }
        return moldura;
    }

    async createMoldura(data: {nome: string, foto: string}): Promise<Moldura> {
        const moldura = this.MolduraRespository.create(data)
        return this.MolduraRespository.save(moldura);
    }

    async updateMoldura(id: string, data: {nome?: string, foto?: string}): Promise<Moldura> {
        const moldura = await this.getMolduraById(id);
        if(!!data.foto){
            this.image.deleteFile(moldura.foto)
        }
        return this.MolduraRespository.save({ ...moldura, ...data });
    }
    
    async getMolduraByNome(nome: string): Promise<Moldura> {
        return await this.MolduraRespository.findOne({nome: nome});;
    }
    
    async findAllMolduras(): Promise<Moldura[]> {
        return await this.MolduraRespository.find() ;
    }

    async deleteMoldura(id: string): Promise<Boolean>{
        const moldura = await this.getMolduraById(id);
        this.MolduraRespository.delete(moldura.id)
        return true
    }
}
