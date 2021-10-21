import { ObjectType, Field, ID, HideField } from "@nestjs/graphql";
import { Chapter } from "src/chapter/chapter.entity";
import { hashPasswordTransform } from "src/common/helpers/crypto";
import { Moldura } from "src/moldura/moldura.entity";
import { Obra } from "src/obra/obra.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";

@ObjectType()
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: string;

    @Column({unique: true})
    nome: string;

    @Column(
        {
            transformer: hashPasswordTransform
        }
    )
    @HideField()
    senha: string;

    @Column({unique: true})
    @HideField()
    email: string;

    @Column({default: "images/fotopadrao.webp"})
    foto: string;

    @Column({default: "images/fundopadrao.webp"})
    fundo: string;

    @Column({default: ""})
    moldura_atual: string;

    @Column({default: ""})
    descricao: string;
    
    @Column({default: 0})
    permissao: number

    @Column()
    @CreateDateColumn()
    created_at: Date
    
    @Column()
    @UpdateDateColumn()
    update_at: Date
    
    @HideField()
    @OneToMany(type => Obra, obra => obra.user)
    obras_cadastradas: Obra[];

    @HideField()
    @OneToMany(type => Chapter, chapters => chapters.user)
    capitulos_postados: Chapter[];

    @ManyToMany(() => Moldura)
    @JoinTable()
    molduras: Moldura[];
}