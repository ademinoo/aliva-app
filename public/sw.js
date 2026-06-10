const CACHE = "aliva-v1";

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(["/"])));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

// Notification push envoyée depuis un serveur (Resend / futur backend)
self.addEventListener("push", (e) => {
  const data = e.data?.json() ?? {};
  e.waitUntil(
    self.registration.showNotification(data.title ?? "Aliva", {
      body: data.body ?? "Ton geste du jour t'attend.",
      icon: "/logo-aliva-iphone.png",
      badge: "/apple-touch-icon.png",
      tag: "aliva-daily",
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow("/tableau-de-bord"));
});
