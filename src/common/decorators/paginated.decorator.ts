import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { PaginatedInterceptor } from '../interceptors/paginated.interceptor';

export function Paginated() {
  return applyDecorators(
    UseInterceptors(PaginatedInterceptor),
  );
}
