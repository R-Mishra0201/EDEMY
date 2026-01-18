import express from 'express';
import upload from '../configs/multer.js'; // Adjust path based on where your multer.js is
import { 
  addCourse, 
  getEducatorCourses, 
  educatorDashboardData,
  updateRoleToEducator,
  getEnrolledStudentsData
} from '../controllers/educatorController.js';

const educatorRouter = express.Router();

// Routes
educatorRouter.post('/update-role', updateRoleToEducator);
educatorRouter.post('/add-course', upload.single('image'), addCourse); // ← Important!
educatorRouter.get('/courses', getEducatorCourses);
educatorRouter.get('/dashboard-data', educatorDashboardData);
educatorRouter.get('/enrolled-students', getEnrolledStudentsData);

export default educatorRouter;