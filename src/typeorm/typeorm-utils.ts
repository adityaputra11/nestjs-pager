import { SelectQueryBuilder, Brackets } from 'typeorm';

/**
 * Apply search condition to a query builder using ILIKE for multiple fields
 */
export function applySearch<T>(
  qb: SelectQueryBuilder<T>,
  alias: string,
  keyword: string,
  fields: (keyof T)[]
) {
  if (!keyword || !fields.length) return qb;

  qb.andWhere(
    new Brackets((qbInner) => {
      for (const field of fields) {
        qbInner.orWhere(`${alias}.${String(field)} ILIKE :search`, {
          search: `%${keyword}%`,
        });
      }
    })
  );

  return qb;
}

/**
 * Apply filters dynamically to a query builder
 */
export function applyFilters<T>(
  qb: SelectQueryBuilder<T>,
  alias: string,
  filters: Record<string, any>
) {
  for (const [key, value] of Object.entries(filters)) {
    qb.andWhere(`${alias}.${key} = :${key}`, { [key]: value });
  }
  return qb;
}

/**
 * Validate and normalize sort field
 */
export function resolveSortField(
  sortBy: string | undefined,
  allowedFields: string[],
  fallbackField: string = 'id'
): string {
  return allowedFields.includes(sortBy || '') ? sortBy! : fallbackField;
}