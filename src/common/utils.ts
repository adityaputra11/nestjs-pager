// utils.ts

/**
 * Encode cursor (for cursor-based pagination) to base64 string
 */
export function encodeCursor(value: string | number): string {
    return Buffer.from(value.toString()).toString('base64');
}

/**
 * Decode cursor from base64 string to original value
 */
export function decodeCursor(cursor: string): string {
    return Buffer.from(cursor, 'base64').toString('utf8');
}

/**
 * Generate cache key from object (e.g. for Redis caching)
 */
export function generateCacheKey(prefix: string, obj: object): string {
    const serialized = JSON.stringify(obj, Object.keys(obj).sort());
    return `${prefix}:${Buffer.from(serialized).toString('base64')}`;
}

/**
 * Validate and normalize sort field
 */
export function normalizeSortField(
    field: string,
    allowedFields: string[],
    defaultField: string,
): string {
    return allowedFields.includes(field) ? field : defaultField;
}