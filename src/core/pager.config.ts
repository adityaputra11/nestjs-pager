// src/core/pager.config.ts

import { Injectable } from '@nestjs/common';


export interface GlobalPagerConfig {
  orm: 'prisma' | 'typeorm';
  defaultLimit?: number;
  maxLimit?: number;
  defaultSortOrder?: 'asc' | 'desc';
  searchFields?: string[];
  sortFields?: string[];
}

@Injectable()
export class PagerConfigService {
  private config: GlobalPagerConfig;

  setConfig(config: GlobalPagerConfig) {
    this.config = config;
  }

  getConfig(): GlobalPagerConfig {
    return this.config;
  }

  getOrm(): 'prisma' | 'typeorm' {
    return this.config.orm;
  }

  getDefaultLimit(): number {
    return this.config.defaultLimit ?? 10;
  }

  getMaxLimit(): number {
    return this.config.maxLimit ?? 100;
  }

  getSearchFields(): string[] {
    return this.config.searchFields ?? [];
  }

  getSortFields(): string[] {
    return this.config.sortFields ?? [];
  }
}