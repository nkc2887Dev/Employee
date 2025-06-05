import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../middlewares/error.middleware';

const departmentSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(2)
    .messages({
      'any.required': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
    }),
  status: Joi.string()
    .required()
    .valid('active', 'inactive')
    .messages({
      'any.required': 'Status is required',
      'any.only': 'Status must be either active or inactive',
    }),
});

export const validateDepartment = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const { error } = departmentSchema.validate(req.body, { abortEarly: false });
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