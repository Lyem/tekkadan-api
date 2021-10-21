import { InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
    @IsString()
    @IsNotEmpty({message: 'Caracteres invalidos'})
    nome: string;

    @IsString()
    @IsNotEmpty({message: 'Caracteres invalidos'})
    senha: string;

    @IsEmail()
    @IsNotEmpty({message: 'E-mail invalido'})
    email: string;
}