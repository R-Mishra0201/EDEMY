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

    // 1. Get Session for Metadata
    const sessions = await stripeInstance.checkout.sessions.list({
      payment_intent: paymentIntent.id,
    });

    if (sessions.data.length > 0) {
      const session = sessions.data[0];
      const { purchaseId } = session.metadata;

      // 2. Find the purchase record
      const purchaseData = await Purchase.findById(purchaseId);
      if (!purchaseData) {
        return response.status(404).json({ message: "Purchase not found" });
      }

      // Check if already processed to prevent double-enrollment
      if (purchaseData.status === 'completed') {
        return response.status(200).json({ message: "Already processed" });
      }

      const { courseId, userId } = purchaseData;

      // 3. ATOMIC UPDATES: This is the most stable way to update arrays
      // Update Course: Add the String userId to the enrolledStudents array
      await Course.findByIdAndUpdate(courseId, {
        $addToSet: { enrolledStudents: userId }
      });

      // Update User: Add the ObjectId courseId to the enrolledCourses array
      await User.findByIdAndUpdate(userId, {
        $addToSet: { enrolledCourses: courseId }
      });

      // 4. Update Purchase Status
      purchaseData.status = 'completed';
      await purchaseData.save();

      console.log(`Successfully completed purchase for User: ${userId}`);
    }
    break;
  } catch (dbError) {
    // If it still fails, this will tell you EXACTLY why in Vercel Logs
    console.error("Database Update Error:", dbError.message);
    return response.status(500).json({ error: dbError.message });
  }
}
  }

  response.json({ received: true });
};