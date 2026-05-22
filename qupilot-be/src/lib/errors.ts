export class AppError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'AppError';
  }
}

export const throw400 = (code: string, message: string): never => {
  throw new AppError(400, code, message);
};

export const throw401 = (code: string, message: string): never => {
  throw new AppError(401, code, message);
};

export const throw403 = (code: string, message: string): never => {
  throw new AppError(403, code, message);
};

export const throw404 = (code: string, message: string): never => {
  throw new AppError(404, code, message);
};

export const throw409 = (code: string, message: string): never => {
  throw new AppError(409, code, message);
};