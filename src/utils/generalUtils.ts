export const safeParse = (str: string, fallback: any = undefined) => {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};
