import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { getOrder, getWhere } from 'src/shared/filterable/typeorm.helper';
import { PaginatedResource } from 'src/shared/filterable/paginated-resource';
import { Filtering } from 'src/shared/filterable/filter.decorator';
import { Sorting } from 'src/shared/filterable/sorting.decorator';
import { Pagination } from 'src/shared/filterable/pagination.decorator';
import { LoggedUser } from 'src/shared/context';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly categoryService: CategoryService,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
    loggedUser: LoggedUser,
  ) {
    const category = await this.categoryService.findOne(
      createTransactionDto.categoryId,
    );

    const entity = this.transactionRepository.create({
      category,
      createdById: loggedUser.id,
      value: createTransactionDto.value,
      description: createTransactionDto.description,
    });

    await this.transactionRepository.save(entity);

    return entity;
  }

  async findAll(
    pagination: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<PaginatedResource<Transaction>> {
    const where = getWhere(filter);
    const order = getOrder(sort);

    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        where,
        order,
        take: pagination.limit,
        skip: pagination.offset,
      },
    );

    return {
      items: transactions,
      total: total,
      page: pagination.page,
      size: pagination.size,
    };
  }

  findOne(id: string) {
    return this.transactionRepository.findOne({ where: { id } });
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.findOne(id);

    if (updateTransactionDto.value) {
      transaction.value = updateTransactionDto.value;
    }

    if (updateTransactionDto.description) {
      transaction.description = updateTransactionDto.description;
    }

    if (updateTransactionDto.categoryId) {
      const category = await this.categoryService.findOne(
        updateTransactionDto.categoryId,
      );

      transaction.category = category;
    }

    await this.transactionRepository.update(
      {
        id,
      },
      transaction,
    );
  }

  remove(id: string) {
    return this.transactionRepository.softDelete(id);
  }
}
