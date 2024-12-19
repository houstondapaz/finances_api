import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { SharedModule } from 'src/shared/shared.module';
import { CategoryModule } from 'src/category/category.module';
import { Budget } from './entities/budget.entity';
import { BudgetsService } from './budget.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Budget]),
    SharedModule,
    CategoryModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, BudgetsService],
})
export class TransactionsModule {}
