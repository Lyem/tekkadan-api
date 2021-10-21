import { InputType } from "@nestjs/graphql";
import { IsEmail, IsOptional, IsString } from "class-validator";

@InputType()
export class AuthInput {
  email: string;
  senha: string;
}
