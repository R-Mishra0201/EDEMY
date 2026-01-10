import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import {v2 as cloudinary} from 'cloudinary';
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";

export const updateRoleToEducator = async (req, res) => {
  try {
    // Calling req.auth() as a function (Fixes Deprecation Warning)
    const auth = req.auth();

    if (!auth || !auth.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = auth.userId;

    // Update user metadata
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

// add new course

export const addCourse = async (req, res) => {
  try {
    const {courseData} = req.body;
    const imageFile = req.file;
    const educatorId = req.auth().userId;
    if(!imageFile){
      return res.json({success: false, message: "Course thumbnail is required"});
    }
    const parsedCourseData = await JSON.parse(courseData);
    parsedCourseData.educator = educatorId;
    const newCourse = await Course.create(parsedCourseData);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();

    res.json({success: true, message: "Course created successfully"});

  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }

}



//  get educator courses

export const getEducatorCourses = async (req,res)=>{
  try {
    const educator = req.auth().userId;
    const courses = await Course.find({educator});
    res.json({success: true, courses});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
}

// get educator dashboard data

export const educatorDashboardData = async()=>{
  try {
    const educator = req.auth().userId;
    const courses = await Course.find({educator});
    const totalCourses = courses.length;
    const courseIds = courses.map(course=> course._id);
    // calculate total earnings from purchases
    const purchases = await Purchase.find({courseId:{$in: courseIds}, status: 'completed'});
    const totalEarnings = purchases.reduce((sum, purchase)=> sum + purchase.amount, 0);
    // collect unique students ids with their course titles
    const enrolledStudentsData = [];
    for(const course of courses){
      const students = await User.find({
        _id: { $in: course.enrolledStudents }

      }, 'name imagerUrl');
      students.forEach(student=>{
        enrolledStudentsData.push({
          courseTitle : course.courseTitle,
          student
        });
    });
    }
    res.json({success: true, dashboardData:{
      totalCourses,
      totalEarnings,
      enrolledStudentsData
    }});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
}

// gett enrolled students data with purchase data

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
   res.status(500).json({success: false, message: error.message}); 
  }
}