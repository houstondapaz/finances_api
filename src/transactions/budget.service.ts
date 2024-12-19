import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { LoggedUser } from 'src/shared/context';
import { Budget } from './entities/budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { AppConfig } from 'src/shared/config/app.config';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
    private readonly categoryService: CategoryService,
    private readonly appConfig: AppConfig,
  ) {}

  async getOrCreateBudget(loggedUser: LoggedUser) {
    const queryBuilder = this.budgetRepository.createQueryBuilder();
    const response = await queryBuilder
      .where(`DATE_TRUNC('month',"date") = DATE_TRUNC('month',NOW())`)
      .getOne();

    if (response) {
      return response;
    }

    return await this.create(
      { value: this.appConfig.defaultBudgetValue },
      loggedUser,
    );
  }

  async create(createBudgetDto: CreateBudgetDto, loggedUser: LoggedUser) {
    const entity = this.budgetRepository.create({
      date: new Date(),
      createdById: loggedUser.id,
      value: createBudgetDto.value,
    });

    await this.budgetRepository.save(entity);

    return entity;
  }

  async update(updateBudgetDto: UpdateBudgetDto, loggedUser: LoggedUser) {
    const budget = await this.getOrCreateBudget(loggedUser);

    if (updateBudgetDto.value) {
      budget.value = updateBudgetDto.value;
    }

    budget.updatedById = loggedUser.id;

    await this.budgetRepository.update(
      {
        id: budget.id,
      },
      budget,
    );
  }
}
