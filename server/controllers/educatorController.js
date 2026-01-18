import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import {v2 as cloudinary} from 'cloudinary';
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";

export const updateRoleToEducator = async (req, res) => {
  try {
    const auth = req.auth();

    if (!auth || !auth.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });

    return res.status(200).json({
      success: true,
      message: "You can publish a course now",
    });
  } catch (error) {
    console.error("Update role error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ CRITICAL FIX: Upload using buffer for Vercel (serverless)
export const addCourse = async (req, res) => {
  try {
    console.log('=== ADD COURSE REQUEST ===');
    
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth().userId;

    console.log('Educator ID:', educatorId);
    console.log('File received:', imageFile ? 'Yes' : 'No');
    console.log('File details:', imageFile);

    if (!imageFile) {
      return res.status(400).json({ 
        success: false, 
        message: "Course thumbnail is required" 
      });
    }

    console.log('Parsing course data...');
    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    console.log('Uploading to Cloudinary...');
    
    // ✅ CRITICAL: For Vercel, use upload_stream with buffer (not file path)
    const imageUpload = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'courses',
          resource_type: 'image'
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload success:', result.secure_url);
            resolve(result);
          }
        }
      );
      
      // Write the file buffer to the upload stream
      uploadStream.end(imageFile.buffer);
    });
    
    console.log('Upload successful:', imageUpload.secure_url);
    
    parsedCourseData.courseThumbnail = imageUpload.secure_url;

    console.log('Creating course in database...');
    const newCourse = await Course.create(parsedCourseData);
    
    console.log('Course created successfully!');

    res.json({ 
      success: true, 
      message: "Course created successfully",
      course: newCourse 
    });

  } catch (error) {
    console.error('=== ADD COURSE ERROR ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}

export const getEducatorCourses = async (req,res)=>{
  try {
    const educator = req.auth().userId;
    const courses = await Course.find({educator});
    res.json({success: true, courses});
  } catch (error) {
    console.error('Get educator courses error:', error);
    res.status(500).json({success: false, message: error.message});
  }
}

export const educatorDashboardData = async (req, res) => { 
  try {
    const educator = req.auth().userId;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;
    
    const courseIds = courses.map(course => course._id);
    
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed'
    });
    const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find({
        _id: { $in: course.enrolledStudents }
      }, 'name imageUrl');

      students.forEach(student => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student
        });
      });
    }

    res.json({
      success: true,
      dashboardData: {
        totalCourses,
        totalEarnings,
        enrolledStudentsData
      }
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const getEnrolledStudentsData = async (req,res)=>{
  try {
    const educator = req.auth().userId;
    const courses = await Course.find({educator});
    const courseIds = courses.map(course=> course._id);
    const purchases = await Purchase.find({courseId: {$in: courseIds}, status: 'completed'}).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

    const enrolledStudents = purchases.map(purchase=> ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));
    res.json({success: true, enrolledStudents});
  } catch (error) {
    console.error('Get enrolled students error:', error);
    res.status(500).json({success: false, message: error.message}); 
  }
}