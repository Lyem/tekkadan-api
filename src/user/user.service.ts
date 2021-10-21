import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import jwtDecode from 'jwt-decode';
import { Moldura } from 'src/moldura/moldura.entity';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}
    
    async getUserById(id: string): Promise<User> {
        const user = await this.userRepository.findOne({id: id},{relations:['obras_cadastradas','molduras']});
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return user;
    }
    
    async getUserByEmail(email: string): Promise<User> {
        var user = await this.userRepository.findOne({email:email},{relations:['molduras']});
        if(!user){
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async getUserByName(name: string): Promise<User> {
        var user = await this.userRepository.findOne({nome:name},{relations:['molduras']});
        if(!user){
            throw new NotFoundException('User not found');
        }
        return user;
    }
    
    async findAllUsers(): Promise<User[]> {
        return await this.userRepository.find({relations:['obras_cadastradas','molduras']}) ;
    }
    
    async updateUser(id: string, data: {nome?: string, descricao?: string, foto?: string, fundo?: string, senha?: string, email?: string}): Promise<User> {
        const user = await this.getUserById(id);
        if(!!data.nome){
            var split = user.nome.split('#')
            data.nome = data.nome + "#" + split[1]
        }
        return this.userRepository.save({ ...user, ...data });
    }

    
    async updateUserTag(id: string, tag: string): Promise<User> {
        const user = await this.getUserById(id)
        var nome = user.nome.split('#')[0] + tag
        return this.userRepository.save({...user, ...{nome: nome}})
    }

    
    async giveMoldura(id: string, moldura: Moldura): Promise<User> {
        const user = await this.getUserById(id);
        const user2 = user;
        user2.molduras.push(moldura)
        return this.userRepository.save({ ...user, ...user2 });
    }

    async throwMoldura(id: string, moldura: Moldura): Promise<User>{
        const user = await this.getUserById(id);
        const user2 = user;
        for (let index = 0; index < user2.molduras.length; index++) {
            if(user2.molduras[index].id == moldura.id){
                user2.molduras.splice(index,1)
            }
        }
        return this.userRepository.save({ ...user, ...user2 });
    }

    async selectMoldura(id: string, moldura: Moldura): Promise<User>{
        const user = await this.getUserById(id);
        const user2 = user;
        for (let index = 0; index < user2.molduras.length; index++) {
            if(user2.molduras[index].id == moldura.id){
                user2.moldura_atual = user2.molduras[index].id
                break
            }
        }
        return this.userRepository.save({ ...user, ...user2 });
    }

    async reseteMoldura(id: string): Promise<User>{
        const user = await this.getUserById(id);
        const user2 = user;
        user2.moldura_atual = ''
        return this.userRepository.save({ ...user, ...user2 });
    }

    async updateUserPerm(token: string, permissao: number, user: User): Promise<User> {
        const adm = await this.getUserById(jwtDecode(token)['sub'])
        if(adm.id == user.id || adm.permissao <= user.permissao || permissao >= adm.permissao){
            throw new UnauthorizedException('Unauthorized');
        }
        return this.userRepository.save({ ...user, permissao});
    }

    async passtheowner(token: string, user: User): Promise<User> {
        const adm = await this.getUserById(jwtDecode(token)['sub'])
        this.userRepository.save({ ...adm, permissao:0});
        return this.userRepository.save({ ...user, permissao:4});
    }
}
