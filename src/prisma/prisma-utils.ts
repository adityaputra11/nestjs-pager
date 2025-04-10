
/**
 * Builds Prisma-compatible OR search conditions for multiple fields
 */
export function buildSearchConditions(keyword: string, fields: string[]): Record<string, any>[] {
  if (!keyword || !fields.length) return [];

  return fields.map((field) => ({
    [field]: {
      contains: keyword,
      mode: 'insensitive',
    },
  }));
}

/**
 * Normalizes Prisma orderBy based on available fields
 */
export function buildOrderBy(
  sortBy: string | undefined,
  sortOrder: 'asc' | 'desc' = 'asc',
  allowedFields: string[] = [],
  fallbackField = 'id',
): Record<string, any> {
  const field = allowedFields.includes(sortBy || '') ? sortBy : fallbackField;
  return { [field!]: sortOrder };
}
