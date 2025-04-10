import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class PaginatedInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (
          typeof data === 'object' &&
          data !== null &&
          'data' in data &&
          'total' in data &&
          'page' in data &&
          'limit' in data
        ) {
          return {
            data: data.data,
            meta: {
              total: data.total,
              page: data.page,
              limit: data.limit,
            },
          };
        }

        return data;
      }),
    );
  }
}
