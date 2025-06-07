import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../middlewares/error.middleware';
import { PHONE_NUMBER } from '../constants/common';

const employeeSchema = Joi.object({
  department_id: Joi.number().required().messages({
    'any.required': 'Department ID is required',
    'number.base': 'Department ID must be a number',
  }),
  name: Joi.string().required().min(2).messages({
    'any.required': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
  }),
  dob: Joi.string()
    .required()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .messages({
      'any.required': 'Date of birth is required',
      'string.pattern.base': 'Invalid date format. Use YYYY-MM-DD',
    }),
  phone: Joi.string().required().pattern(PHONE_NUMBER).messages({
    'any.required': 'Phone number is required',
    'string.pattern.base': 'Invalid phone number',
  }),
  email: Joi.string().required().email().messages({
    'any.required': 'Email is required',
    'string.email': 'Invalid email address',
  }),
  salary: Joi.number().required().positive().messages({
    'any.required': 'Salary is required',
    'number.base': 'Salary must be a number',
    'number.positive': 'Salary must be positive',
  }),
  status: Joi.string().required().valid('active', 'inactive').messages({
    'any.required': 'Status is required',
    'any.only': 'Status must be either active or inactive',
  }),
});

export const validateEmployee = (req: Request, _res: Response, next: NextFunction) => {
  try {
    // Convert string numbers to actual numbers
    const data = {
      ...req.body,
      department_id: Number(req.body.department_id),
      salary: Number(req.body.salary),
    };

    const { error } = employeeSchema.validate(data, { abortEarly: false });
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
