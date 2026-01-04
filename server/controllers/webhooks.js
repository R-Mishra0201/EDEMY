import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const payload = req.body.toString(); // RAW body
    const headers = req.headers;

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const evt = whook.verify(payload, {
      "svix-id": headers["svix-id"],
      "svix-timestamp": headers["svix-timestamp"],
      "svix-signature": headers["svix-signature"],
    });

    const { data, type } = evt;

    const email =
      data.email_addresses && data.email_addresses.length > 0
        ? data.email_addresses[0].email_address
        : null;

    const name = `${data.first_name || ""} ${data.last_name || ""}`.trim();

    switch (type) {
      case "user.created": {
        if (!email) break;

        await User.findByIdAndUpdate(
          data.id,
          {
            _id: data.id,
            email,
            name,
            imageUrl: data.image_url,
          },
          { upsert: true } // prevents duplicate key crash
        );
        break;
      }

      case "user.updated": {
        if (!email) break;

        await User.findByIdAndUpdate(data.id, {
          email,
          name,
          imageUrl: data.image_url,
        });
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }

      default:
        break;
    }

    // IMPORTANT: always return 200
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error.message);
    // still return 200 to stop retries
    res.status(200).json({ success: false });
  }
};
