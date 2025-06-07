import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { AppError } from './error.middleware';

export const validateRequest = (schema: Schema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Convert string numbers to actual numbers for specific fields
      const data = { ...req.body };
      if (data.department_id) {
        data.department_id = Number(data.department_id);
      }
      if (data.salary) {
        data.salary = Number(data.salary);
      }

      const { error } = schema.validate(data, { abortEarly: false });
      if (error) {
        throw new AppError(error.details[0].message, 400);
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new AppError('Validation error', 400));
      }
    }
  };
};
