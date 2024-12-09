import { Type } from 'class-transformer';
import {
  IsString,
  IsPositive,
  IsOptional,
  IsInt,
  IsNotEmpty,
  IsEnum,
  IsAlphanumeric,
  IsArray,
  ValidateNested,
} from 'class-validator';

export enum FilterOperator {
  EQUALS = 'eq',
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
  @IsAlphanumeric()
  value?: string;
}

export class PaginationOptions {
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @IsInt()
  page: number;
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @IsInt()
  limit: number;
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
