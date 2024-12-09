import {
  IsNull,
  Not,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  ILike,
  In,
  FindOptionsWhere,
} from 'typeorm';

import { QueryFilter, FilterOperator, Sorting } from './pagination-options';

export const getOrder = (sort: Sorting) =>
  sort ? { [sort.property]: sort.direction } : {};

export function getWhere<T>(filters: QueryFilter[]): FindOptionsWhere<T> {
  if (!filters?.length) return {};

  return filters.reduce<FindOptionsWhere<T>>(
    (where: FindOptionsWhere<T>, filter: QueryFilter) => {
      if (filter.operator == FilterOperator.IS_NULL)
        return {
          ...where,
          [filter.property]: IsNull(),
        };
      if (filter.operator == FilterOperator.IS_NOT_NULL)
        return {
          ...where,
          [filter.property]: Not(IsNull()),
        };
      if (filter.operator == FilterOperator.EQUALS)
        return {
          ...where,
          [filter.property]: filter.value,
        };
      if (filter.operator == FilterOperator.NOT_EQUALS)
        return {
          ...where,
          [filter.property]: Not(filter.value),
        };
      if (filter.operator == FilterOperator.GREATER_THAN)
        return {
          ...where,
          [filter.property]: MoreThan(filter.value),
        };
      if (filter.operator == FilterOperator.GREATER_THAN_OR_EQUALS)
        return {
          ...where,
          [filter.property]: MoreThanOrEqual(filter.value),
        };
      if (filter.operator == FilterOperator.LESS_THAN)
        return {
          ...where,
          [filter.property]: LessThan(filter.value),
        };
      if (filter.operator == FilterOperator.LESS_THAN_OR_EQUALS)
        return {
          ...where,
          [filter.property]: LessThanOrEqual(filter.value),
        };
      if (filter.operator == FilterOperator.LIKE)
        return {
          ...where,
          [filter.property]: ILike(`%${filter.value}%`),
        };
      if (filter.operator == FilterOperator.NOT_LIKE)
        return {
          ...where,
          [filter.property]: Not(ILike(`%${filter.value}%`)),
        };
      if (filter.operator == FilterOperator.IN)
        return {
          ...where,
          [filter.property]: In(filter.value.split(',')),
        };
      if (filter.operator == FilterOperator.NOT_IN)
        return {
          ...where,
          [filter.property]: Not(In(filter.value.split(','))),
        };

      return where;
    },
    {},
  );
}
