import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "vijoy-power-solution",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "527277487994",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:527277487994:web:2d6293d248eefe5afb08c3",
};

export const VAPID_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ||
  "BEe5lfcLMcQIMvQZDcmD-BbZQxLG0q944wlCCwcNXukJ5LeqauL1osV5N3rEKJNgz17F2HI6FVyUgUKXciidFbE";

export function getFirebaseApp() {
  if (typeof window === "undefined") return null;
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseMessaging(): Messaging | null {
  if (typeof window === "undefined") return null;
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    return null;
  }
  try {
    const app = getFirebaseApp();
    if (!app) return null;
    return getMessaging(app);
  } catch (err) {
    console.warn("[Firebase Messaging Client] Initialization notice:", err);
    return null;
  }
}

export async function requestPushPermissionAndToken(): Promise<{
  token: string | null;
  permission: NotificationPermission;
  error?: string;
}> {
  if (typeof window === "undefined") {
    return { token: null, permission: "denied", error: "Window undefined" };
  }

  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    return {
      token: null,
      permission: "denied",
      error: "Web Push Notifications are not supported in this browser.",
    };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return { token: null, permission, error: "Notification permission was denied." };
    }

    // Register service worker
    const swRegistration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
      scope: "/",
    });
    await navigator.serviceWorker.ready;

    const messaging = getFirebaseMessaging();
    if (!messaging) {
      return { token: null, permission, error: "Firebase messaging failed to initialize." };
    }

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });

    if (token) {
      // Send token to server
      await fetch("/api/admin/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }).catch((e) => console.warn("Failed to save push token on server:", e));

      return { token, permission };
    } else {
      return { token: null, permission, error: "Failed to generate FCM token." };
    }
  } catch (err: any) {
    console.error("[FCM Permission Error]", err);
    return {
      token: null,
      permission: typeof Notification !== "undefined" ? Notification.permission : "denied",
      error: err?.message || "Failed to enable notifications.",
    };
  }
}

export function subscribeForegroundMessages(
  callback: (payload: { title?: string; body?: string; link?: string; data?: any }) => void
) {
  const messaging = getFirebaseMessaging();
  if (!messaging) return () => {};

  return onMessage(messaging, (payload) => {
    const title = payload.notification?.title || payload.data?.title || "New Solar Lead";
    const body = payload.notification?.body || payload.data?.body || "A new customer lead was received.";
    const link = payload.data?.link || "/admin/leads";
    callback({ title, body, link, data: payload.data });
  });
}
