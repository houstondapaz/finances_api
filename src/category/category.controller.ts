import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginateResourceInterceptor } from 'src/shared/filterable/paginated-resource.interceptor';
import { Category } from './entities/category.entity';
import { PaginationOptions } from 'src/shared/filterable/pagination-options';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser, LoggedUser } from 'src/shared/context';

@UseGuards(JwtGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser()
    loggedUser: LoggedUser,
  ) {
    return this.categoryService.create(createCategoryDto, loggedUser);
  }

  @Get()
  @UseInterceptors(PaginateResourceInterceptor<Category>)
  findAll(@Query() query: PaginationOptions) {
    return this.categoryService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser()
    loggedUser: LoggedUser,
  ) {
    return this.categoryService.update(id, updateCategoryDto, loggedUser);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser()
    loggedUser: LoggedUser,
  ) {
    return this.categoryService.remove(id, loggedUser);
  }
}
