import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Obra } from "src/obra/obra.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany} from "typeorm";

@ObjectType()
@Entity()
export class Author {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: string;

    @Column({unique: true})
    nome: string;

    @Column({default: "images/fotopadrao.webp"})
    foto: string;

    @ManyToMany(type => Obra, obras => obras.autor)
    obras: Obra[]
}