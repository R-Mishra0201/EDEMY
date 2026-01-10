import express from 'express';
import { addCourse,educatorDashboardData,getEducatorCourses,updateRoleToEducator,getEnrolledStudentsData } from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';
import { get } from 'mongoose';
const educatorRouter = express.Router();

// Route to add educator role
// Endpoint: POST /api/educator/update-role
educatorRouter.post('/update-role', updateRoleToEducator);

educatorRouter.post('/add-course', upload.single('image'), protectEducator, addCourse);

educatorRouter.get('/courses',protectEducator,getEducatorCourses)
educatorRouter.get('/dashboard',protectEducator,educatorDashboardData)
educatorRouter.get('/enrolled-students',protectEducator,getEnrolledStudentsData)


export default educatorRouter;