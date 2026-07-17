export interface SortState { column: string; direction: 'asc' | 'desc' | 'none'; }
export function sortData<T>(data: T[], sort: SortState): T[] {
  if (!sort.column || sort.direction === 'none') return data;
  return [...data].sort((a: any, b: any) => {
    const av = a[sort.column] ?? '', bv = b[sort.column] ?? '';
    const cmp = typeof av === 'number' && typeof bv === 'number'
      ? av - bv
      : String(av).toLowerCase().localeCompare(String(bv).toLowerCase());
    return sort.direction === 'asc' ? cmp : -cmp;
  });
}
