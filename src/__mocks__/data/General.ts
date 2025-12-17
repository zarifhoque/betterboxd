export const validPaginationCases: Array<{ query: Record<string, any>; desc: string }> = [
  { query: {}, desc: 'no pagination params (defaults applied)' },
  { query: { page: 1, itemsPerPage: 10 }, desc: 'page + itemsPerPage' },
  { query: { page: 2 }, desc: 'page only (default itemsPerPage applied)' },
  { query: { itemsPerPage: 5 }, desc: 'itemsPerPage only (default page applied)' },
  { query: { offset: 10, limit: 5 }, desc: 'offset + limit' },
  { query: { offset: 20 }, desc: 'offset only (default limit applied)' },
  { query: { limit: 15 }, desc: 'limit only (default offset applied)' },
  {
    query: { startAfter: '550e8400-e29b-41d4-a716-446655440001', limit: 10 },
    desc: 'startAfter + limit',
  },
  {
    query: { startAfter: '550e8400-e29b-41d4-a716-446655440001' },
    desc: 'startAfter only (default limit applied)',
  },
];
