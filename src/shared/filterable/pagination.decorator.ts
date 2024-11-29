import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export interface Pagination {
  page: number;
  limit: number;
  size: number;
  offset: number;
}

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = '10';
const DEFAULT_PAGE = '1';

export const PaginationParams = createParamDecorator(
  (data, ctx: ExecutionContext): Pagination => {
    const req: Request = ctx.switchToHttp().getRequest();
    const page = Number.parseInt((req.query.page || DEFAULT_PAGE) as string);
    const size = Number.parseInt(
      (req.query.size || DEFAULT_PAGE_SIZE) as string,
    );

    if (Number.isNaN(page) || page < 0 || Number.isNaN(size) || size < 0) {
      throw new BadRequestException('Invalid pagination params');
    }

    if (size > MAX_PAGE_SIZE) {
      throw new BadRequestException(
        `Invalid pagination params: Max size is ${MAX_PAGE_SIZE}`,
      );
    }

    // calculate pagination parameters
    const limit = size;
    const offset = page * limit;
    return { page, limit, size, offset };
  },
);
