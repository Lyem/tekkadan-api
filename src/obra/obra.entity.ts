import { ObjectType, Field, ID, HideField } from "@nestjs/graphql";
import { Author } from "src/authors/authors.entity";
import { Category } from "src/category/category.entity";
import { Chapter } from "src/chapter/chapter.entity";
import { User } from "src/user/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinTable} from "typeorm";

@ObjectType()
@Entity()
export class Obra {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: string;

    @Column()
    nome: string;

    @ManyToMany(() => Category)
    @JoinTable()
    categorias: Category[];

    @ManyToMany(type => Author, authors => authors.obras)
    @JoinTable()
    autor: Author[];

    @ManyToMany(type => Author, authors => authors.obras)
    @JoinTable()
    artista: Author[];

    @Column({default: "images/capaobrapadrao.webp"})
    capa: string;

    @Column({default: "images/fundoobrapadrao.webp"})
    fundo: string;

    @Column({default: ""})
    ondeoanimeparou: string;

    @Column()
    @CreateDateColumn()
    created_at: Date;
    
    @Column()
    @UpdateDateColumn()
    update_at: Date;

    @ManyToOne(type=> User, user => user.obras_cadastradas)
    user: User;

    @HideField()
    @OneToMany(type=> Chapter, chapters => chapters.obra,{
        onDelete: "CASCADE",
    })
    chapters: Chapter[];
}