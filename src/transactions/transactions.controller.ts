import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
  Pagination,
  PaginationParams,
} from 'src/shared/filterable/pagination.decorator';
import {
  Sorting,
  SortingParams,
} from 'src/shared/filterable/sorting.decorator';
import {
  Filtering,
  FilteringParams,
} from 'src/shared/filterable/filter.decorator';
import { CurrentUser, LoggedUser } from 'src/shared/context';

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
  findAll(
    @PaginationParams() paginationParams: Pagination,
    @SortingParams(['value']) sort?: Sorting,
    @FilteringParams(['description']) filter?: Filtering,
  ) {
    return this.transactionsService.findAll(paginationParams, sort, filter);
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
