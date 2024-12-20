import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { getOrder, getWhere } from 'src/shared/filterable/typeorm.helper';
import { PaginatedResource } from 'src/shared/filterable/paginated-resource';
import { LoggedUser } from 'src/shared/context';
import {
  FilterOperator,
  PaginationOptions,
} from 'src/shared/filterable/pagination-options';
import { BudgetsService } from './budget.service';
import * as dayjs from 'dayjs';
import { randomUUID } from 'node:crypto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly categoryService: CategoryService,
    private readonly budgetsService: BudgetsService,
  ) {}

  async getExpensesAndBudget(loggedUser: LoggedUser) {
    const queryBuilder = this.transactionRepository.createQueryBuilder();
    const response = await queryBuilder
      .select(`DATE_TRUNC('month',"date")`, 'month')
      .addSelect('SUM("value")', 'value')
      .addGroupBy('month')
      .where(`DATE_TRUNC('month', "date") = DATE_TRUNC('month', NOW())`)
      .execute();

    const spent = response[0]?.value as number;
    const budget = await this.budgetsService.getOrCreateBudget(loggedUser);

    return {
      spent,
      budget: budget.value,
    };
  }

  async create(
    createTransactionDto: CreateTransactionDto,
    loggedUser: LoggedUser,
  ) {
    const category = await this.categoryService.findOne(
      createTransactionDto.categoryId,
    );

    const installmentsValue =
      createTransactionDto.value / createTransactionDto.installments;
    const entities = [];

    const installmentsCode = randomUUID();

    for (
      let installment = 1;
      installment <= createTransactionDto.installments;
      installment++
    ) {
      entities.push(
        this.transactionRepository.create({
          category,
          date: dayjs(createTransactionDto.date)
            .add(installment - 1, 'M')
            .toDate(),
          createdById: loggedUser.id,
          value: installmentsValue,
          installment,
          totalInstallments: createTransactionDto.installments,
          installmentsCode,
          description:
            createTransactionDto.installments === 1
              ? createTransactionDto.description
              : `${createTransactionDto.description} (${installment}/${createTransactionDto.installments})`,
        }),
      );
    }

    await this.transactionRepository.insert(entities);

    return entities;
  }

  async findAll(
    pagination: PaginationOptions,
  ): Promise<PaginatedResource<Transaction>> {
    const where = getWhere(pagination.filters);
    const order = getOrder(pagination.sort);

    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        where,
        relations: ['category'],
        order,
        take: pagination.limit,
        skip: pagination.skip,
      },
    );

    return {
      items: transactions,
      total: total,
      page: pagination.page,
      pageSize: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit) || 1,
    };
  }

  findOne(id: string) {
    return this.transactionRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    loggedUser: LoggedUser,
  ) {
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

    if (updateTransactionDto.date) {
      transaction.date = new Date(updateTransactionDto.date);
    }

    transaction.createdById = loggedUser.id;

    await this.transactionRepository.update(
      {
        id,
      },
      transaction,
    );
  }

  async remove(id: string, loggedUser: LoggedUser) {
    const transaction = await this.findOne(id);
    const installments = await this.findAll({
      filters: [
        {
          operator: FilterOperator.EQUALS,
          property: 'installmentsCode',
          value: transaction.installmentsCode,
        },
      ],
      limit: 100,
      page: 1,
      skip: 0,
    });

    await Promise.all(
      installments.items.map((i) =>
        this.transactionRepository.manager.transaction(async (em) => {
          await em.update<Transaction>(
            Transaction,
            { id: i.id },
            { deletedBy: loggedUser.id },
          );
          return em.softDelete<Transaction>(Transaction, { id: i.id });
        }),
      ),
    );
  }
}
