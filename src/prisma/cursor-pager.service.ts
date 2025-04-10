import { Injectable } from '@nestjs/common';
import { PagerOptionsDto } from '../common/dto/pager.option.dto';
import { decodeCursor, encodeCursor } from '../common/utils';
import { CursorPaginatedResult } from '../common/type';

@Injectable()
export class CursorPagerService {
  async paginate<T>(
    model: {
      findMany: (args: any) => Promise<T[]>;
    },
    options: PagerOptionsDto,
    config: {
      cursorField: keyof T;
      direction?: 'asc' | 'desc';
      filters?: Record<string, any>;
      searchFields?: (keyof T)[];
    },
  ): Promise<CursorPaginatedResult<T>> {
    const {
      cursorField,
      direction = 'desc',
      filters = {},
      searchFields = [],
    } = config;

    const limit = options.limit ?? 10;
    const cursorValue = options.cursor ? decodeCursor(options.cursor) : null;

    const where: Record<string, any> = { ...filters };

    if (options.search && searchFields.length > 0) {
      where.OR = searchFields.map((field) => ({
        [field]: {
          contains: options.search,
          mode: 'insensitive',
        },
      }));
    }

    const findArgs: any = {
      take: limit,
      orderBy: { [cursorField]: direction },
      where,
    };

    if (cursorValue !== null) {
      findArgs.cursor = { [cursorField]: cursorValue };
      findArgs.skip = 1;
    }

    const data = await model.findMany(findArgs);

    const nextCursor =
      data.length === limit
        ? encodeCursor((data[data.length - 1] as any)[cursorField])
        : undefined;

    return { data, nextCursor };
  }
}
