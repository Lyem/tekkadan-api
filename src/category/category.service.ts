import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ) {}

    async getCategoryById(id: string): Promise<Category> {
        const category = await this.categoryRepository.findOne({id: id});
        if (!category) {
          throw new NotFoundException('Category not found');
        }
        return category;
    }

    async createCategory(data: {nome: string}): Promise<Category> {
        const category = this.categoryRepository.create(data);
        return await this.categoryRepository.save(category);
    }

    async updateCategory(id: string, data: {nome: string}): Promise<Category> {
        const category = await this.getCategoryById(id);
        return this.categoryRepository.save({ ...category, ...data });
    }

    async deleteCategory(id: string): Promise<Boolean>{
        const category = await this.getCategoryById(id);
        this.categoryRepository.delete(category.id)
        return true
    }
}
