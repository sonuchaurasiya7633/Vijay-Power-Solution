import { initializeApp, getApps, getApp, cert, App } from "firebase-admin/app";
import { getMessaging, MulticastMessage } from "firebase-admin/messaging";
import connectDB from "@/lib/db/connection";
import Notification, { INotification } from "@/models/Notification";
import AdminPushSubscription from "@/models/AdminPushSubscription";

function getFirebaseAdminApp(): App | null {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0];
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "vijoy-power-solution";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    // Handle escaped newlines from environment variable formatting
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  if (projectId && clientEmail && privateKey) {
    try {
      return initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (err) {
      console.error("[Firebase Admin] Initialization error:", err);
      return null;
    }
  } else {
    // In-app notifications in MongoDB will still function cleanly
    return null;
  }
}

export interface BroadcastNotificationParams {
  title: string;
  body: string;
  type?: "lead" | "survey" | "quotation" | "installation" | "system";
  link?: string;
  leadId?: any;
  metadata?: Record<string, any>;
}

export async function createAndBroadcastNotification(
  params: BroadcastNotificationParams
): Promise<INotification> {
  await connectDB();

  // 1. Persist notification history in MongoDB
  const notification = await Notification.create({
    title: params.title,
    body: params.body,
    type: params.type || "lead",
    link: params.link || "/admin/leads",
    leadId: params.leadId || undefined,
    metadata: params.metadata || {},
    isRead: false,
  });

  // 2. Broadcast Web Push to all registered Admin FCM tokens
  try {
    await sendPushNotificationToAdmins({
      title: params.title,
      body: params.body,
      link: params.link || "/admin/leads",
      leadId: params.leadId ? String(params.leadId) : undefined,
    });
  } catch (pushErr) {
    console.warn("[Push Broadcast Notice]", pushErr);
  }

  return notification;
}

export async function sendPushNotificationToAdmins({
  title,
  body,
  link = "/admin/leads",
  leadId,
}: {
  title: string;
  body: string;
  link?: string;
  leadId?: string;
}) {
  await connectDB();

  const subscriptions = await AdminPushSubscription.find({}, { token: 1 }).lean();
  if (!subscriptions || subscriptions.length === 0) {
    return { successCount: 0, failureCount: 0, skipped: true, reason: "No active admin subscriptions" };
  }

  const tokens = subscriptions.map((s) => s.token).filter(Boolean);
  if (tokens.length === 0) return { successCount: 0, failureCount: 0 };

  const adminApp = getFirebaseAdminApp();
  if (!adminApp) {
    return {
      successCount: 0,
      failureCount: tokens.length,
      skipped: true,
      reason: "Firebase Admin credentials (FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY) not configured yet.",
    };
  }

  const message: MulticastMessage = {
    tokens,
    notification: {
      title,
      body,
    },
    data: {
      title,
      body,
      link,
      leadId: leadId || "",
    },
    webpush: {
      fcmOptions: {
        link,
      },
      notification: {
        title,
        body,
        icon: "/images/logo.png",
        badge: "/images/logo.png",
        requireInteraction: true,
      },
    },
  };

  const messaging = getMessaging(adminApp);
  const response = await messaging.sendEachForMulticast(message);

  // Clean up invalid or expired tokens automatically
  if (response.failureCount > 0) {
    const invalidTokens: string[] = [];
    response.responses.forEach((resp: any, idx: number) => {
      if (!resp.success) {
        const errCode = resp.error?.code;
        if (
          errCode === "messaging/invalid-registration-token" ||
          errCode === "messaging/registration-token-not-registered"
        ) {
          invalidTokens.push(tokens[idx]);
        }
      }
    });

    if (invalidTokens.length > 0) {
      await AdminPushSubscription.deleteMany({ token: { $in: invalidTokens } });
    }
  }

  return {
    successCount: response.successCount,
    failureCount: response.failureCount,
  };
}
