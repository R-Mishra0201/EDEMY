import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

// Clerk Webhook Controller
export const clerkWebhooks = async (req, res) => {
  try {
    const payload = req.body.toString();
    const headers = req.headers;
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const evt = whook.verify(payload, {
      "svix-id": headers["svix-id"],
      "svix-timestamp": headers["svix-timestamp"],
      "svix-signature": headers["svix-signature"],
    });

    const { data, type } = evt;
    const email = data.email_addresses?.[0]?.email_address || null;
    const name = `${data.first_name || ""} ${data.last_name || ""}`.trim();

    switch (type) {
      case "user.created":
        await User.findByIdAndUpdate(data.id, {
          _id: data.id,
          email,
          name,
          imageUrl: data.image_url,
        }, { upsert: true });
        break;
      case "user.updated":
        await User.findByIdAndUpdate(data.id, { email, name, imageUrl: data.image_url });
        break;
      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Clerk Webhook Error:", error.message);
    res.status(200).json({ success: false });
  }
};

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe Webhook Controller
export const stripeWebhooks = async (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    // Ensure request.body is the RAW Buffer from express.raw()
    event = stripeInstance.webhooks.constructEvent(
      request.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripe Verification Error:", err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle Event Types
  switch (event.type) {
    case 'payment_intent.succeeded': {
  try {
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    // Get the session to find the metadata
    const sessions = await stripeInstance.checkout.sessions.list({
      payment_intent: paymentIntentId,
    });

    if (!sessions.data.length) {
       console.log("No session found for this payment intent");
       break;
    }

    const session = sessions.data[0];
    const { purchaseId } = session.metadata;

    const purchaseData = await Purchase.findById(purchaseId);
    if (!purchaseData) {
       console.log("Purchase document not found in DB");
       break;
    }

    // UPDATE DATABASE USING ATOMIC OPERATORS (Prevents 500 errors)
    // 1. Add student to Course
    await Course.findByIdAndUpdate(purchaseData.courseId, {
      $addToSet: { enrolledStudents: purchaseData.userId }
    });

    // 2. Add course to User
    await User.findByIdAndUpdate(purchaseData.userId, {
      $addToSet: { enrolledCourses: purchaseData.courseId }
    });

    // 3. Mark Purchase as completed
    purchaseData.status = 'completed';
    await purchaseData.save();

    console.log(`Success: User ${purchaseData.userId} enrolled in Course ${purchaseData.courseId}`);

  } catch (error) {
    console.error("Database update failed:", error.message);
    // Return a 500 so Stripe retries, or 200 if you want to stop retries
    return response.status(500).json({ success: false, message: error.message });
  }
  break;
}
  }

  response.json({ received: true });
};