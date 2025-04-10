import { Injectable } from '@nestjs/common';
import { PagerOptionsDto } from '../common/dto/pager.option.dto';
import { PaginatedResult } from '../common/type';

@Injectable()
export class PrismaPagerService {
  async paginate<T>(
    model: {
      findMany: (args: any) => Promise<T[]>;
      count: (args?: any) => Promise<number>;
    },
    options: PagerOptionsDto,
    config?: {
      filters?: Record<string, any>;
      searchFields?: (keyof T)[];
      include?: any;
      select?: any;
      orderBy?: any;
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

    const offset = (page - 1) * limit;

    const where: Record<string, any> = { ...filters };

    if (search && config?.searchFields?.length) {
      where.OR = config.searchFields.map((field) => ({
        [field]: { contains: search, mode: 'insensitive' },
      }));
    }

    const findArgs: any = {
      where,
      skip: offset,
      take: limit,
      include: config?.include,
      select: config?.select,
      orderBy: sortBy ? { [sortBy]: sortOrder ?? 'asc' } : config?.orderBy,
    };

    const [data, total] = config?.skipTotalCount
      ? [await model.findMany(findArgs), 0]
      : await Promise.all([
        model.findMany(findArgs),
        model.count({ where }),
      ]);

    return { data, total, page, limit };
  }
}
