import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { PaginatedResource } from 'src/shared/filterable/paginated-resource';

@Injectable()
export class PaginateResourceInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<PaginatedResource<T>> {
    return next
      .handle()
      .pipe(
        tap((data) => {
          if (data && (data.total || data.totalPages || data.page)) {
            const response = context.switchToHttp().getResponse();
            response.header('X-Total', data.total?.toString());
            response.header('X-Pages', data.totalPages);
            response.header('X-Page', data.page || 1);
          }
          delete data.totalPages;
          delete data.page;
          delete data.pageSize;
        }),
      )
      .pipe(
        map((data) => {
          if (data) {
            return data.items;
          }
        }),
      );
  }
}
