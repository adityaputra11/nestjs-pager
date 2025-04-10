import { Injectable, OnModuleInit, Optional } from '@nestjs/common';
import { PagerOptionsDto } from '../common/dto/pager.option.dto';
import { PaginatedResult, CursorPaginatedResult } from '../common/type';
import { PrismaPagerService } from '../prisma/prisma-pager.service';
import { CursorPagerService } from '../prisma/cursor-pager.service';
import { TypeOrmPagerService } from '../typeorm/typeorm-pager.service';
import { PagerConfigService } from './pager.config';

@Injectable()
export class PagerService implements OnModuleInit {
  private orm: 'prisma' | 'typeorm' = 'prisma';

  constructor(
    private readonly configService: PagerConfigService,
    @Optional() private readonly prismaPager?: PrismaPagerService,
    @Optional() private readonly cursorPager?: CursorPagerService,
    @Optional() private readonly typeOrmPager?: TypeOrmPagerService,
  ) { }

  onModuleInit() {
    this.orm = this.configService.getOrm();
  }

  async paginate<T>(
    source: any,
    options: PagerOptionsDto,
    config?: any,
  ): Promise<PaginatedResult<T>> {
    if (this.orm === 'prisma') {
      return this.prismaPager!.paginate(source, options, config);
    }

    if (this.orm === 'typeorm') {
      return this.typeOrmPager!.paginate(source, options, config);
    }

    throw new Error(`Unsupported ORM: ${this.orm}`);
  }

  async paginateCursor<T>(
    source: any,
    options: PagerOptionsDto,
    config: {
      cursorField: keyof T;
      direction?: 'asc' | 'desc';
      filters?: Record<string, any>;
      searchFields?: (keyof T)[];
    },
  ): Promise<CursorPaginatedResult<T>> {
    if (this.orm === 'prisma') {
      return this.cursorPager!.paginate(source, options, config);
    }

    throw new Error('Cursor pagination is only supported for Prisma.');
  }
}