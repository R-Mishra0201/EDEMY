import express from 'express';
import upload from '../configs/multer.js';
import { 
  addCourse, 
  getEducatorCourses, 
  educatorDashboardData,
  updateRoleToEducator,
  getEnrolledStudentsData
} from '../controllers/educatorController.js';
import { requireAuth } from '@clerk/express';

const educatorRouter = express.Router();

// Apply auth middleware to all routes
educatorRouter.use(requireAuth());

// Routes
educatorRouter.post('/update-role', updateRoleToEducator);
educatorRouter.post('/add-course', upload.single('image'), addCourse);
educatorRouter.get('/courses', getEducatorCourses);
educatorRouter.get('/dashboard-data', educatorDashboardData); // ✅ Matches frontend call
educatorRouter.get('/enrolled-students', getEnrolledStudentsData);

export default educatorRouter;