export const safeParse = (str: string, fallback: any = undefined) => {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

export const cleanQuery = (query: any): any => {
  if (!query || typeof query !== 'object') return query;
  const isId = (key: string): boolean => key === 'id' || key === '_id';
  query = { ...query };
  if (query.id) {
    query._id = query.id;
    delete query.id;
  }
  Object.keys(query).forEach(key => {
    if (query[key] === undefined) delete query[key];
    if (typeof query[key] === 'string' && !isId(key)) query[key] = new RegExp(query[key], 'i');
  });
  return query;
}
