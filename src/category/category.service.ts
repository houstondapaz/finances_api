import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { getOrder, getWhere } from 'src/shared/filterable/typeorm.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResource } from 'src/shared/filterable/paginated-resource';
import { CategoryAlreadyExistsException } from './exceptions/category-already-exists.exception';
import { PaginationOptions } from 'src/shared/filterable/pagination-options';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    if (
      await this.categoriesRepository.existsBy({
        name: createCategoryDto.name,
      })
    ) {
      throw new CategoryAlreadyExistsException(createCategoryDto.name);
    }

    const entity = this.categoriesRepository.create({
      name: createCategoryDto.name,
      icon: createCategoryDto.icon,
    });

    await this.categoriesRepository.save(entity);

    return entity;
  }

  async findAll(
    pagination: PaginationOptions,
  ): Promise<PaginatedResource<Category>> {
    const where = getWhere(pagination.filters);
    const order = getOrder(pagination.sort);

    const [categories, total] = await this.categoriesRepository.findAndCount({
      where,
      order,
      take: pagination.limit,
      skip: pagination.skip,
    });

    return {
      items: categories,
      total: total,
      page: pagination.page,
      pageSize: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit) || 1,
    };
  }

  async findOne(id: string): Promise<Category> {
    return this.categoriesRepository.findOne({ where: { id } });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (updateCategoryDto.name) {
      category.name = updateCategoryDto.name;
    }

    if (updateCategoryDto.icon) {
      category.icon = updateCategoryDto.icon;
    }

    await this.categoriesRepository.update(
      {
        id,
      },
      category,
    );
  }

  remove(id: string) {
    return this.categoriesRepository.softDelete(id);
  }
}
