import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

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

export const stripeWebhooks = async (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Stripe Verification Error:", err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Switch case for event types
    switch (event.type) {
        case 'payment_intent.succeeded': {
            try {
                const paymentIntent = event.data.object;
                
                // Pehle direct metadata check karein (Fastest)
                let purchaseId = paymentIntent.metadata?.purchaseId;

                // Agar metadata direct nahi mila, toh session list karein (Fallback)
                if (!purchaseId) {
                    const sessions = await stripeInstance.checkout.sessions.list({
                        payment_intent: paymentIntent.id,
                    });
                    if (sessions.data.length > 0) {
                        purchaseId = sessions.data[0].metadata.purchaseId;
                    }
                }

                if (!purchaseId) {
                    console.error("Purchase ID not found in metadata for PaymentIntent:", paymentIntent.id);
                    return response.status(400).json({ message: "No purchaseId found" });
                }

                const purchaseData = await Purchase.findById(purchaseId);
                
                if (!purchaseData) {
                    console.error("Purchase not found in MongoDB for ID:", purchaseId);
                    return response.status(404).json({ message: "Purchase not found" });
                }

                if (purchaseData.status === 'completed') {
                    console.log("Already processed purchase:", purchaseId);
                    return response.status(200).json({ received: true });
                }

                const { courseId, userId } = purchaseData;

                // Atomic Updates: Course aur User ko sync karein
                await Course.findByIdAndUpdate(courseId, {
                    $addToSet: { enrolledStudents: userId }
                });

                await User.findByIdAndUpdate(userId, {
                    $addToSet: { enrolledCourses: courseId }
                });

                // Status update karein
                purchaseData.status = 'completed';
                await purchaseData.save();

                console.log(`Successfully completed purchase for User: ${userId} and Course: ${courseId}`);

            } catch (dbError) {
                console.error("Database Update Error:", dbError.message);
                return response.status(500).json({ error: dbError.message });
            }
            break;
        }

        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object;
            // Handle failure status update
            const sessions = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntent.id,
            });
            if (sessions.data.length > 0) {
                const { purchaseId } = sessions.data[0].metadata;
                await Purchase.findByIdAndUpdate(purchaseId, { status: 'failed' });
            }
            break;
        }

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    response.json({ received: true });
};