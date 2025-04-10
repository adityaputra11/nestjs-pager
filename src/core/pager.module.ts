// src/core/pager.module.ts

import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { PrismaPagerService } from '../prisma/prisma-pager.service';
import { CursorPagerService } from '../prisma/cursor-pager.service';
import { TypeOrmPagerService } from '../typeorm/typeorm-pager.service';
import { PagerService } from './pager.service';
import { PagerConfigService, GlobalPagerConfig } from './pager.config';

@Global()
@Module({})
export class PagerModule {
  static forRoot(options: GlobalPagerConfig): DynamicModule {
    const providers: Provider[] = [PagerConfigService, PagerService];

    if (options.orm === 'prisma') {
      providers.push(PrismaPagerService, CursorPagerService);
    }

    if (options.orm === 'typeorm') {
      providers.push(TypeOrmPagerService);
    }

    return {
      module: PagerModule,
      providers: [
        ...providers,
        {
          provide: 'PAGER_CONFIG_OPTIONS',
          useValue: options,
        },
        {
          provide: 'INIT_PAGER_CONFIG',
          inject: [PagerConfigService],
          useFactory: (config: PagerConfigService) => {
            config.setConfig(options);
          },
        },
      ],
      exports: [PagerService],
    };
  }
}