import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Chapter } from "src/chapter/chapter.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";

@ObjectType()
@Entity()
export class Page {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: string;

    @Column()
    page: string;

    @ManyToOne(type=> Chapter, chapter => chapter.pages)
    chapter: Chapter
}