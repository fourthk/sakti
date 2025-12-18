import { useState, useRef, useEffect } from "react";
import {
  Menu,
  Bell,
  User,
  Mail,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import saktiLogo from "@/assets/sakti-logo.png";

const API_BASE_URL =
  "https://sakti-backend-674826252080.asia-southeast2.run.app";

interface Notification {
  id: string;
  title: string;
  body: string;
  channel: string;
  sent_at: string;
  read_at: string | null;
  created_at: string;
  cr_id: string | null;
}

interface UserData {
  name: string;
  email: string;
  role: string;
  instansi: string;
}


interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [loadingNotif, setLoadingNotif] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target as Node) &&
        userRef.current &&
        !userRef.current.contains(e.target as Node)
      ) {
        setShowNotif(false);
        setShowUser(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const json = await res.json();
      setUser(json.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoadingNotif(true);
      const res = await fetch(`${API_BASE_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const json = await res.json();
      setNotifications(json.data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoadingNotif(false);
    }
  };


  const markAsRead = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchNotifications();
    } catch (err) {
      console.error("Error mark as read:", err);
    }
  };

  const toggleNotif = () => {
    setShowNotif(!showNotif);
    setShowUser(false);
    fetchNotifications();
  };

  const toggleUser = () => {
    setShowUser((v) => !v);
    setShowNotif(false);
    fetchProfile();
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch {}
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 shadow"
      style={{ height: "80px", backgroundColor: "#384E66" }}
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-white hover:bg-white/10 p-2 rounded"
        >
          <Menu size={24} />
        </button>
        <img src={saktiLogo} alt="Logo" className="h-12" />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* NOTIF */}
         <div className="relative" ref={notifRef}>
            <button
              onClick={toggleNotif}
              className="text-white hover:bg-white/10 p-2 rounded transition-colors relative"
            >
              <Bell size={24} />
              {notifications.some((n) => !n.read_at) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {showNotif && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="p-4 border-b bg-[#384E66]">
                  <h3 className="text-white font-semibold">Notifikasi</h3>
                </div>

                {loadingNotif ? (
                  <div className="p-4 text-center text-gray-500">Memuat...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Tidak ada notifikasi
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={cn(
                          "p-4 border-b cursor-pointer hover:bg-gray-50",
                          !notif.read_at && "bg-blue-50"
                        )}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-sm">{notif.title}</p>
                          {!notif.read_at && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notif.body}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notif.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        {/* USER */}
        <div ref={userRef} className="relative">
          <button
            onClick={toggleUser}
            className="text-white hover:bg-white/10 p-2 rounded-full"
          >
            <User size={24} />
          </button>
          {showUser && user && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 bg-[#384E66] flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold leading-tight">
                    {user.name}
                  </p>
                  <p className="text-white/80 text-sm flex items-center gap-1">
                    <Mail size={14} /> {user.email}
                  </p>
                </div>
              </div>
              <div className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Role:</span>
                  <span className="font-medium uppercase">
                    {user.role}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Instansi:</span>
                  <span className="font-medium">
                    {user.instansi}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full p-3 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 border-t"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
