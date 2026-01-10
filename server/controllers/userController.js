import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Stripe from 'stripe';
import Course from "../models/Course.js";

// Get user data
export const getUserData = async (req, res) => {
    try {
        // Updated to use req.auth() function
        const { userId } = req.auth(); 
        const user = await User.findById(userId);
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// User enrolled courses with lecture links
export const userEnrollledCourses = async (req, res) => {
    try {
        // Updated to use req.auth() function
        const { userId } = req.auth(); 
        const userData = await User.findById(userId).populate('enrolledCourses');
        
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, enrolledCourses: userData.enrolledCourses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Purchase course
export const purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        // Fix: Clerk SDK version compatibility
        const { userId } = req.auth(); 
        
        const userData = await User.findById(userId);
        const courseData = await Course.findById(courseId);
        const origin = req.headers.origin || "http://localhost:5173";

        if (!userData || !courseData) {
            return res.json({ success: false, message: "Data not found" });
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2),
        }

        const newPurchase = await Purchase.create(purchaseData);
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        const line_items = [{
            price_data: {
                currency: process.env.CURRENCY.toLowerCase(),
                product_data: {
                    name: courseData.courseTitle,
                },
                // Use Math.round for accurate cent conversion
                unit_amount: Math.round(newPurchase.amount * 100) 
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            // Crucial: Metadata in PaymentIntent for Stripe Webhook success
            payment_intent_data: {
                metadata: {
                    purchaseId: newPurchase._id.toString(),
                }
            },
            metadata: {
                purchaseId: newPurchase._id.toString(),
            }
        })

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}