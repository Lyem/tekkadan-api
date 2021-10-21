import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync } from 'bcrypt';
import jwtDecode from 'jwt-decode';
import { CreateUserInput } from 'src/user/dto/create-user.input';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { AuthInput } from './dto/auth.input';
import { AuthType } from './dto/auth.type';
import { JwtStrategy } from './jwt.strategy';

@Injectable()
export class AuthService {
    constructor(
      @InjectRepository(User)
      private userRepository: Repository<User>,
      private userService: UserService,
      private jwtService: JwtService,
      private jwtStrategy: JwtStrategy
      ) {}
    
    async createUser(data: CreateUserInput): Promise<AuthType> {
      const datauser = this.userRepository.create(data);
      const user = await this.userRepository.save(datauser);
      const token = await this.jwtToken(user);
      return {
        user,
        token
      }
    }

    async pad(number:number, length:number): Promise<string> {
      var str = '' + number;
      while (str.length < length) {
        str = '0' + str;
      }
      return str;
    }
  
    async validateUser(data: AuthInput): Promise<AuthType> {
      const user = await this.userService.getUserByEmail(data.email)
  
      const validPasssword = compareSync(data.senha, user.senha);
  
      if(!validPasssword) {
        throw new UnauthorizedException('Incorrect password')
      }
  
      const token = await this.jwtToken(user);
  
      return {
        user,
        token
      }
    }

    async authorization(token: string,permissao: number): Promise<boolean>{
      const user = await this.jwtStrategy.validate(jwtDecode(token))
      if( user.permissao < permissao ){
        throw new UnauthorizedException('Unauthorized');
      }
      return true
    }
  
    private async jwtToken(user: User): Promise<string> {
      const payload = { sub: user.id };
      return this.jwtService.signAsync(payload);
    }
  }
