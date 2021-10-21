import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@ObjectType()
@Entity()
export class Moldura {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: string;

    @Column({unique: true})
    nome: string;

    @Column()
    foto: string;
}