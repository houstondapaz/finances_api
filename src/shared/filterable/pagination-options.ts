import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsPositive,
  IsOptional,
  IsInt,
  IsNotEmpty,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';

export enum FilterOperator {
  EQUALS = 'eq',
  BETWEEN = 'between',
  NOT_EQUALS = 'neq',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUALS = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUALS = 'lte',
  LIKE = 'like',
  NOT_LIKE = 'nlike',
  IN = 'in',
  NOT_IN = 'nin',
  IS_NULL = 'isnull',
  IS_NOT_NULL = 'isnotnull',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export class Sorting {
  @Type(() => String)
  @IsNotEmpty()
  property: string;
  @Type(() => String)
  @IsNotEmpty()
  @IsEnum(SortDirection)
  direction: SortDirection;
}

export class QueryFilter {
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  property: string;

  @IsEnum(FilterOperator)
  @IsNotEmpty()
  operator: FilterOperator;

  @IsOptional()
  value?: string;
}

export class PaginationOptions {
  @Type(() => Number)
  @Transform((p) => {
    return p.value || 1;
  })
  @IsOptional()
  @IsPositive()
  @IsInt()
  page: number = 1;

  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @IsInt()
  limit: number = 50;

  @Type(() => QueryFilter)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  filters?: QueryFilter[];

  @IsOptional()
  sort?: Sorting;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
