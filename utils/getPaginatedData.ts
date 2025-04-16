import { Language } from "../schemas/enum.schema";

export const getPaginatedData = <TArray extends unknown[]>(
  dataArray: TArray,
  options: { page: number; limit: number; language: Language },
) => {
  const { page, limit } = options;
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = dataArray.slice(start, end);
  const metadata = {
    generatedOn: new Date().toISOString(),
    language: options.language,
  };
  const total = dataArray.length;
  return {
    metadata,
    data,
    page,
    limit,
    total,
  };
};
