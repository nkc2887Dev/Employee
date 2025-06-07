import { Router } from 'express';
import { validateRequest } from '../middlewares/validate.middleware';
import { departmentSchema } from '../validations/schemas';
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from '../controllers/department.controller';

const router = Router();

router.post('/', validateRequest(departmentSchema), createDepartment);
router.get('/', getAllDepartments);
router.get('/:id', getDepartmentById);
router.put('/:id', validateRequest(departmentSchema), updateDepartment);
router.delete('/:id', deleteDepartment);

export default router;
