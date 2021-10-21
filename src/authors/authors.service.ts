import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './authors.entity';

@Injectable()
export class AuthorsService {
    constructor(
        @InjectRepository(Author)
        private AuthorRepository: Repository<Author>,
    ) {}

    async getAuthorById(id: string): Promise<Author> {
        const Author = await this.AuthorRepository.findOne({id: id},{relations:['obras']});
        if (!Author) {
          throw new NotFoundException('Author not found');
        }
        return Author;
    }

    async createAuthor(data: {nome: string}): Promise<Author> {
        const Author = this.AuthorRepository.create(data);
        return await this.AuthorRepository.save(Author);
    }

    async findAllAuthors(): Promise<Author[]> {
        return await this.AuthorRepository.find({relations:['obras']}) ;
    }

    async updateAuthor(id: string, data: {nome?: string, foto?: string}): Promise<Author> {
        const Author = await this.getAuthorById(id);
        return this.AuthorRepository.save({ ...Author, ...data });
    }

    async deleteAuthor(id: string): Promise<Boolean>{
        const Author = await this.getAuthorById(id);
        this.AuthorRepository.delete(Author.id)
        return true
    }
}
