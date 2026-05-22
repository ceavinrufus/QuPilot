import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { ZodType } from 'zod';

type Source = 'body' | 'query' | 'params';

export const validate =
  <T>(schema: ZodType<T>, source: Source = 'body'): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      next(result.error);
      return;
    }
    if (source === 'body') {
      req.body = result.data;
    } else if (source === 'query') {
      (req as unknown as { validatedQuery: T }).validatedQuery = result.data;
    } else {
      req.params = result.data as unknown as Request['params'];
    }
    next();
  };