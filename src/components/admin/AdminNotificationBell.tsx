"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Trash2,
  ExternalLink,
  Zap,
  Info,
  Calendar,
  Send,
  ShieldCheck,
  AlertTriangle,
  X,
  Volume2,
  VolumeX,
  Music,
} from "lucide-react";
import { toast } from "sonner";
import { requestPushPermissionAndToken, subscribeForegroundMessages } from "@/lib/firebase/client";
import {
  playNotificationSound,
  unlockAudioContext,
  isSoundEnabled,
  setSoundEnabled,
} from "@/lib/utils/notificationSound";

export interface NotificationItem {
  _id: string;
  title: string;
  body: string;
  type: "lead" | "survey" | "quotation" | "installation" | "system";
  link: string;
  isRead: boolean;
  leadId?: {
    _id: string;
    leadId: string;
    fullName: string;
    phone: string;
    city: string;
    state: string;
  };
  createdAt: string;
}

export default function AdminNotificationBell() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [permissionState, setPermissionState] = useState<NotificationPermission>("default");
  const [isRequestingPerm, setIsRequestingPerm] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [soundActive, setSoundActive] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const prevUnreadRef = useRef<number>(0);
  const hasHydratedRef = useRef<boolean>(false);

  // Check initial browser notification permission & sound preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("Notification" in window) {
        setPermissionState(Notification.permission);
      }
      setSoundActive(isSoundEnabled());

      // Unlock Web Audio context on first user click or touch anywhere on the page
      const handleUserGesture = () => {
        unlockAudioContext();
      };
      window.addEventListener("click", handleUserGesture, { once: true });
      window.addEventListener("touchstart", handleUserGesture, { once: true });

      return () => {
        window.removeEventListener("click", handleUserGesture);
        window.removeEventListener("touchstart", handleUserGesture);
      };
    }
  }, []);

  const fetchNotifications = useCallback(async (silent = true) => {
    try {
      const res = await fetch("/api/admin/notifications", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const data = await res.json();
        const items = data.notifications || [];
        const newUnread = Number(data.unreadCount || 0);

        setNotifications(items);
        setUnreadCount(newUnread);

        // Play chime if new unread notifications arrived while active
        if (hasHydratedRef.current && newUnread > prevUnreadRef.current) {
          playNotificationSound();
        }

        prevUnreadRef.current = newUnread;
        hasHydratedRef.current = true;
      }
    } catch (err) {
      if (!silent) console.warn("Fetch notifications error:", err);
    }
  }, []);

  // Initial fetch and 10s auto-polling
  useEffect(() => {
    fetchNotifications(false);

    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchNotifications(true);
      }
    }, 10000);

    const handleFocus = () => fetchNotifications(true);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [fetchNotifications]);

  // Listen to foreground FCM push messages
  useEffect(() => {
    const unsubscribe = subscribeForegroundMessages((payload) => {
      // 1. Play audible chime immediately
      playNotificationSound();

      // 2. Refresh notification list & counter
      fetchNotifications(true);

      // 3. Show rich toast notification
      toast.success(payload.title || "New Solar Lead!", {
        description: payload.body || "A new customer inquiry was received.",
        action: {
          label: "View Lead",
          onClick: () => {
            if (payload.link) router.push(payload.link);
          },
        },
      });
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [fetchNotifications, router]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggleSound = () => {
    unlockAudioContext();
    const nextState = !soundActive;
    setSoundActive(nextState);
    setSoundEnabled(nextState);

    if (nextState) {
      // Play instant confirmation chime so user can hear the volume
      playNotificationSound();
      toast.success("Notification sound enabled");
    } else {
      toast.info("Notification sound muted");
    }
  };

  const handleTestChime = () => {
    unlockAudioContext();
    playNotificationSound();
    toast.success("Playing notification chime", {
      description: "Sound output is active and verified.",
    });
  };

  const handleEnablePush = async () => {
    unlockAudioContext();
    setIsRequestingPerm(true);
    try {
      const result = await requestPushPermissionAndToken();
      setPermissionState(result.permission);
      if (result.permission === "granted") {
        playNotificationSound();
        toast.success("Push Notifications & Sound Enabled!", {
          description: "You will receive instant push alerts with sound whenever a new solar lead arrives.",
        });
      } else if (result.permission === "denied") {
        toast.error("Notification permission denied", {
          description: "Please enable notification permissions in your browser address bar settings.",
        });
      }
    } catch (e: any) {
      toast.error("Failed to enable push notifications", {
        description: e?.message || "Please check browser notification settings.",
      });
    } finally {
      setIsRequestingPerm(false);
    }
  };

  const handleSendTestPush = async () => {
    unlockAudioContext();
    setIsSendingTest(true);
    try {
      const res = await fetch("/api/admin/notifications/test", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        // Play instant notification sound
        playNotificationSound();
        toast.success("Test notification & sound sent!", {
          description: "Check your screen/notification center for the push notification.",
        });
        fetchNotifications(true);
      } else {
        toast.error("Failed to send test push", { description: data?.error });
      }
    } catch (e) {
      toast.error("Error dispatching test push");
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));

      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);

      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const target = notifications.find((n) => n._id === id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (target && !target.isRead) {
        setUnreadCount((c) => Math.max(0, c - 1));
      }

      await fetch(`/api/admin/notifications?id=${id}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearRead = async () => {
    try {
      setNotifications((prev) => prev.filter((n) => !n.isRead));
      await fetch("/api/admin/notifications?clearRead=true", { method: "DELETE" });
      toast.success("Read notifications cleared");
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = (item: NotificationItem) => {
    unlockAudioContext();
    if (!item.isRead) {
      handleMarkAsRead(item._id);
    }
    setIsOpen(false);
    router.push(item.link || "/admin/leads");
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
      if (diffSec < 60) return "Just now";
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return `${diffHour}h ago`;
      const diffDays = Math.floor(diffHour / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => {
          unlockAudioContext();
          setIsOpen(!isOpen);
        }}
        className="relative w-9 h-9 rounded-xl border border-slate-border bg-white text-navy-800 hover:bg-slate-50 flex items-center justify-center transition-all shadow-2xs cursor-pointer group"
        aria-label="View notifications"
        title="Admin Notifications"
      >
        <Bell className="w-4 h-4 text-slate-muted group-hover:text-navy-800 transition-colors" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center px-1 rounded-full bg-rose-600 text-[10px] font-extrabold text-white shadow-sm ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[min(94vw,420px)] bg-white rounded-2xl border border-slate-border shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-bg/50">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm text-navy-800">Notifications</span>
              {unreadCount > 0 ? (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  {unreadCount} unread
                </span>
              ) : (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  All caught up
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {/* Sound Toggle Button */}
              <button
                type="button"
                onClick={handleToggleSound}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                  soundActive
                    ? "text-solar-green bg-solar-green-light hover:bg-solar-green/20"
                    : "text-slate-400 bg-slate-100 hover:text-navy-800"
                }`}
                title={soundActive ? "Notification sound is ON (click to mute)" : "Notification sound is MUTED (click to enable)"}
              >
                {soundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-solar-green hover:bg-white text-xs font-medium transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              {notifications.some((n) => n.isRead) && (
                <button
                  type="button"
                  onClick={handleClearRead}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white text-xs font-medium transition-colors"
                  title="Clear read notifications"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-navy-800 hover:bg-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Browser Push Permission & Sound Test Bar */}
          <div className="px-4 py-2.5 bg-navy-50/70 border-b border-slate-100 flex items-center justify-between gap-2 text-xs">
            {permissionState === "granted" ? (
              <div className="flex items-center gap-1.5 text-solar-green font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Web Push & Sound Active</span>
              </div>
            ) : permissionState === "denied" ? (
              <div className="flex items-center gap-1.5 text-amber-600 font-medium text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Push Blocked in Browser</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-navy-800 font-medium text-[11px]">
                <Bell className="w-3.5 h-3.5 text-solar-green" />
                <span>Get Instant Lead Alerts</span>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              {/* Test Sound Chime Button */}
              <button
                type="button"
                onClick={handleTestChime}
                className="px-2 py-0.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-navy-800 font-bold text-[10px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                title="Test audio sound output directly"
              >
                <Music className="w-2.5 h-2.5 text-solar-green" />
                <span>Test Sound</span>
              </button>

              {permissionState !== "granted" ? (
                <button
                  type="button"
                  onClick={handleEnablePush}
                  disabled={isRequestingPerm}
                  className="px-2.5 py-1 rounded-lg bg-solar-green hover:bg-solar-green-hover text-white font-bold text-[10px] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isRequestingPerm ? "Enabling..." : "Enable Push"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSendTestPush}
                  disabled={isSendingTest}
                  className="px-2 py-0.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-navy-800 font-bold text-[10px] inline-flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                  title="Send a live test notification to verify push delivery"
                >
                  <Send className="w-2.5 h-2.5 text-solar-green" />
                  <span>{isSendingTest ? "Sending..." : "Test Push"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-navy-800">No notifications yet</p>
                <p className="text-[11px] text-slate-muted">
                  New customer inquiries and survey requests will appear here automatically with sound alerts.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group hover:bg-slate-50/80 ${
                    !item.isRead ? "bg-solar-green-light/20" : "bg-white"
                  }`}
                >
                  {/* Type Icon */}
                  <div
                    className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center mt-0.5 ${
                      item.type === "lead"
                        ? "bg-solar-green-light text-solar-green"
                        : item.type === "survey"
                        ? "bg-solar-yellow-light text-solar-yellow-hover"
                        : "bg-navy-50 text-navy-800"
                    }`}
                  >
                    {item.type === "lead" ? (
                      <Zap className="w-4 h-4" />
                    ) : item.type === "survey" ? (
                      <Calendar className="w-4 h-4" />
                    ) : (
                      <Info className="w-4 h-4" />
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4
                        className={`text-xs truncate ${
                          !item.isRead ? "font-bold text-navy-800" : "font-medium text-slate-700"
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-muted line-clamp-2 mt-0.5 leading-relaxed">
                      {item.body}
                    </p>

                    {item.leadId && (
                      <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                        <span className="bg-slate-100 px-1.5 py-0.2 rounded font-bold text-navy-800">
                          {item.leadId.leadId}
                        </span>
                        <span>{item.leadId.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions on hover */}
                  <div className="flex flex-col items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100">
                    {!item.isRead && (
                      <button
                        type="button"
                        onClick={(e) => handleMarkAsRead(item._id, e)}
                        className="w-5 h-5 rounded hover:bg-slate-200 text-slate-400 hover:text-solar-green flex items-center justify-center transition-colors"
                        title="Mark as read"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleDelete(item._id, e)}
                      className="w-5 h-5 rounded hover:bg-rose-50 text-slate-300 hover:text-rose-500 flex items-center justify-center transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-100 bg-slate-bg/40 flex items-center justify-between text-xs">
            <Link
              href="/admin/leads"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold text-solar-green hover:underline flex items-center gap-1"
            >
              <span>View Inbound Leads</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <span className="text-[10px] text-slate-400">Firebase FCM &bull; Audio Chime Active</span>
          </div>
        </div>
      )}
    </div>
  );
}
