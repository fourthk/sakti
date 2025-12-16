import { useState, useRef, useEffect } from "react";
import { Menu, Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getToken, getUser, logout, API_BASE } from "@/lib/auth";
import SaktiLogo from "@/assets/sakti-logo.png";

interface Notification {
  id: string;
  message: string;
  read: boolean;
}

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setNotifications(json.data || []);
    } catch {
      setNotifications([]);
    }
  };

  const fetchUserProfile = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setUserProfile(json.data || getUser());
    } catch {
      setUserProfile(getUser());
    }
  };

  const handleNotificationClick = () => {
    if (!notificationsOpen) {
      fetchNotifications();
    }
    setNotificationsOpen(!notificationsOpen);
    setUserMenuOpen(false);
  };

  const handleUserMenuClick = () => {
    if (!userMenuOpen) {
      fetchUserProfile();
    }
    setUserMenuOpen(!userMenuOpen);
    setNotificationsOpen(false);
  };

  const handleMarkAsRead = async (id: string) => {
    const token = getToken();
    if (!token) return;
    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      // silent fail
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setUserMenuOpen(false);
  };

  const confirmLogout = async () => {
    const token = getToken();
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // continue with logout even if API fails
    }
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const user = getUser();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 shadow"
        style={{ height: "80px", backgroundColor: "#384E66" }}
      >
     <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="text-primary-foreground hover:bg-primary-foreground/10 p-2 rounded"
          >
            <Menu size={24} />
          </button>

          <img
          src="/src/assets/sakti-logo.png"
          alt="SAKTI Logo"
          className="h-12 w-auto"
          style={{ transform: "scale(0.9)" }}
          />
        </div>

        <div className="flex items-center gap-4">
          <div ref={notificationRef} className="relative">
            <button
              onClick={handleNotificationClick}
              className="text-primary-foreground hover:bg-primary-foreground/10 p-2 rounded relative"
            >
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              )}
            </button>
            {notificationsOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-72 rounded-lg shadow-lg border"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <div className="p-3 border-b font-medium" style={{ color: "#384E66" }}>
                  Notifications
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleMarkAsRead(n.id)}
                        className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${
                          !n.read ? "bg-muted/30" : ""
                        }`}
                      >
                        <p className="text-sm" style={{ color: "#384E66" }}>
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div ref={userMenuRef} className="relative">
            <button
              onClick={handleUserMenuClick}
              className="text-primary-foreground hover:bg-primary-foreground/10 p-2 rounded-full"
            >
              <User size={24} />
            </button>
            {userMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-64 rounded-lg shadow-lg border"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <div className="p-4">
                  <p className="font-medium" style={{ color: "#384E66" }}>
                    {userProfile?.name || user?.name || "User"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {userProfile?.email || user?.email || "email@example.com"}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize mt-1">
                    Role: {userProfile?.role || user?.role || "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Instansi: {userProfile?.instansi || user?.instansi || "N/A"}
                  </p>
                </div>
                <div className="border-t">
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-muted/50"
                    style={{ color: "#384E66" }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50">
          <div
            className="rounded-lg shadow-lg p-6 w-80"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <h3 className="text-lg font-medium mb-4" style={{ color: "#384E66" }}>
              Confirm Logout
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 rounded border hover:bg-muted/50"
                style={{ color: "#384E66" }}
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2 rounded text-primary-foreground"
                style={{ backgroundColor: "#384E66" }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
