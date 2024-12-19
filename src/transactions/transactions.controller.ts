import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CurrentUser, LoggedUser } from 'src/shared/context';
import { PaginationOptions } from 'src/shared/filterable/pagination-options';
import { Transaction } from './entities/transaction.entity';
import { PaginateResourceInterceptor } from 'src/shared/filterable/paginated-resource.interceptor';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @CurrentUser()
    loggedUser: LoggedUser,
  ) {
    return this.transactionsService.create(createTransactionDto, loggedUser);
  }

  @Get()
  @UseInterceptors(PaginateResourceInterceptor<Transaction>)
  findAll(@Query() query: PaginationOptions) {
    return this.transactionsService.findAll(query);
  }

  @Get('budget')
  budget(
    @CurrentUser()
    loggedUser: LoggedUser,
  ) {
    return this.transactionsService.getExpensesAndBudget(loggedUser);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(id);
  }
}
