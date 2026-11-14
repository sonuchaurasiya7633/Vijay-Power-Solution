/* eslint-disable no-undef */
// Firebase Cloud Messaging Service Worker - VIJOY POWER SOLUTION

importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyDlfmnsYMi-0aIom-l-hJoMxlkCYGHqZDE",
  projectId: "vijoy-power-solution",
  messagingSenderId: "527277487994",
  appId: "1:527277487994:web:2d6293d248eefe5afb08c3",
};

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const title =
      payload.notification?.title ||
      payload.data?.title ||
      "VIJOY POWER SOLUTION - New Solar Lead";
    const body =
      payload.notification?.body ||
      payload.data?.body ||
      "A new solar enquiry has been received.";
    const link = payload.data?.link || payload.fcmOptions?.link || "/admin/leads";

    const notificationOptions = {
      body: body,
      icon: "/images/logo.png",
      badge: "/images/logo.png",
      tag: payload.data?.leadId || "vps-solar-lead",
      renotify: true,
      requireInteraction: true,
      vibrate: [200, 100, 200],
      data: {
        link: link,
        leadId: payload.data?.leadId,
      },
      actions: [
        {
          action: "open_lead",
          title: "View Enquiry",
        },
      ],
    };

    return self.registration.showNotification(title, notificationOptions);
  });
} catch (e) {
  console.warn("[SW] Firebase messaging background init notice:", e);
}

// Background notification click event handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.link || "/admin/leads";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // If an admin tab is already open, navigate and focus it
      for (const client of windowClients) {
        if (client.url.includes("/admin") && "focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Otherwise open a new tab with the target URL
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
