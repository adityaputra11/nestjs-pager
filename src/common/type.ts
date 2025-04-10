// type.ts

export type SortOrder = 'asc' | 'desc';

export interface PagerOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: SortOrder;
    search?: string;
    filters?: Record<string, any>;
}

export interface PaginateOptions {
    skipTotalCount?: boolean;
    cacheKey?: string;
    cacheService?: {
        getOrSet<T>(key: string, ttl: number, fallback: () => Promise<T>): Promise<T>;
    };
}

export interface CursorPaginateOptions {
    cursor?: string;
    limit?: number;
    sortOrder?: SortOrder;
    cursorField?: string;
    filters?: Record<string, any>;
    search?: string;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export interface CursorPaginatedResult<T> {
    data: T[];
    nextCursor?: string;
}