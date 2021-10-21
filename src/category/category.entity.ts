import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@ObjectType()
@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: string;

    @Column({unique: true})
    nome: string;
}