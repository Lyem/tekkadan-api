import { ObjectType, Field, ID, HideField } from "@nestjs/graphql";
import { Obra } from "src/obra/obra.entity";
import { Page } from "src/pages/pages.entity";
import { User } from "src/user/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";

@ObjectType()
@Entity()
export class Chapter {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: string;

    @Column()
    titulo: string;

    @Column()
    numero: string;

    @OneToMany(type=> Page, pages => pages.chapter,{
        onDelete: "CASCADE"
    })
    pages: Page[];

    @HideField()
    @ManyToOne(type=> Obra, obra => obra.chapters)
    obra: Obra

    @HideField()
    @ManyToOne(type => User, user => user.capitulos_postados)
    user: User;
}