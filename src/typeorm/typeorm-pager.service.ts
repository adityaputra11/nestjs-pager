import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder, Brackets } from 'typeorm';
import { PagerOptionsDto } from '../common/dto/pager.option.dto';
import { PaginatedResult } from '../common/type';


@Injectable()
export class TypeOrmPagerService {
  async paginate<T>(
    qb: SelectQueryBuilder<T>,
    options: PagerOptionsDto,
    config?: {
      searchFields?: (keyof T)[];
      filters?: Record<string, any>;
      alias?: string;
      skipTotalCount?: boolean;
    },
  ): Promise<PaginatedResult<T>> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy,
      sortOrder,
      filters = {},
    } = options;

    const alias = config?.alias || qb.alias;
    const offset = (page - 1) * limit;

    if (search && config?.searchFields?.length) {
      qb.andWhere(new Brackets((qbInner) => {
        for (const field of config.searchFields!) {
          qbInner.orWhere(`${alias}.${String(field)} ILIKE :search`, {
            search: `%${search}%`,
          });
        }
      }));
    }

    for (const [key, value] of Object.entries(filters)) {
      qb.andWhere(`${alias}.${key} = :${key}`, { [key]: value });
    }

    if (sortBy) {
      qb.orderBy(`${alias}.${sortBy}`, sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
    }

    qb.take(limit).skip(offset);

    const [data, total] = config?.skipTotalCount
      ? [await qb.getMany(), 0]
      : await qb.getManyAndCount();

    return { data, total, page, limit };
  }
}
