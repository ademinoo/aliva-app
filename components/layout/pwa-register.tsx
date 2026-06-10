"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function nowMinutes(): number {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
}

function todayKey(prefix: string): string {
  return `${prefix}_${new Date().toISOString().split("T")[0]}`;
}

export function PwaRegister() {
  useEffect(() => {
    // Enregistrer le service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Vérifier et déclencher les notifications locales
    async function checkNotifications() {
      if (typeof Notification === "undefined") return;
      if (Notification.permission !== "granted") return;

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("notification_preferences")
        .select("reveil_actif, reveil_heure, coucher_actif, coucher_heure")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!data) return;

      const now = nowMinutes();
      const WINDOW = 45; // fenêtre de 45 min après l'heure définie

      if (data.reveil_actif && data.reveil_heure) {
        const key = todayKey("aliva_notif_reveil");
        const diff = now - timeToMinutes(data.reveil_heure);
        if (diff >= 0 && diff < WINDOW && !localStorage.getItem(key)) {
          localStorage.setItem(key, "1");
          new Notification("Aliva · Bonjour", {
            body: "Ton geste du jour t'attend. Prends 2 minutes pour toi ce matin.",
            icon: "/logo-aliva-iphone.png",
            tag: "aliva-reveil",
          });
        }
      }

      if (data.coucher_actif && data.coucher_heure) {
        const key = todayKey("aliva_notif_coucher");
        const diff = now - timeToMinutes(data.coucher_heure);
        if (diff >= 0 && diff < WINDOW && !localStorage.getItem(key)) {
          localStorage.setItem(key, "1");
          new Notification("Aliva · Bonsoir", {
            body: "Dernier check avant de dormir. Comment s'est passée ta journée ?",
            icon: "/logo-aliva-iphone.png",
            tag: "aliva-coucher",
          });
        }
      }
    }

    checkNotifications();
  }, []);

  return null;
}
