// PATCH semantics of Prisma: a field set to `undefined` means "leave as is", `null` means "clear".
// TypeORM would write an explicit `undefined` property as-is in some paths, so drop such keys before merging.
export function omitUndefined<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined),
  ) as Partial<T>;
}
