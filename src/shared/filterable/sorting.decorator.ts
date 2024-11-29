import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export interface Sorting {
  property: string;
  direction: string;
}

const DEFAULT_SORT_PARAMS = ['createdAt', 'updatedAt'];

export const SortingParams = createParamDecorator(
  (validParams, ctx: ExecutionContext): Sorting => {
    const req: Request = ctx.switchToHttp().getRequest();
    const sort = req.query.sort as string;
    if (!sort) return null;

    if (Array.isArray(validParams)) {
      throw new BadRequestException('Invalid sort parameter');
    }

    const sortPattern = /^([a-zA-Z0-9]+):(asc|desc)$/;
    if (!sort.match(sortPattern)) {
      throw new BadRequestException('Invalid sort parameter');
    }

    const [property, direction] = sort.split(':');
    if (!DEFAULT_SORT_PARAMS.concat(validParams).includes(property)) {
      throw new BadRequestException(`Invalid sort property: ${property}`);
    }

    return { property, direction };
  },
);
