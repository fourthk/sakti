import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    console.log("[Login] Checking authentication status...");
    if (isAuthenticated()) {
      console.log("[Login] User already authenticated, redirecting to dashboard");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("[Login] Attempting login for user:", username);

    try {
      const response = await api.login(username, password);
      console.log("[Login] Login API response:", response);
      
      // Handle nested response structure: response.data.token and response.data.user
      const tokenValue = response.data?.token || response.token || response.access_token;
      const userData = response.data?.user || response.user;
      
      if (tokenValue) {
        localStorage.setItem("token", tokenValue);
        console.log("[Login] Token stored successfully");
      } else {
        console.error("[Login] No token found in response");
        toast.error("Login failed: No token received");
        setLoading(false);
        return;
      }
      
      if (userData) {
        // Map API role to app role based on username or role field
        const mappedUser = {
          ...userData,
          role: mapApiRoleToAppRole(userData.username, userData.role)
        };
        localStorage.setItem("user", JSON.stringify(mappedUser));
        console.log("[Login] User data stored:", mappedUser);
        console.log("[Login] Mapped user role:", mappedUser.role);
      } else {
        console.error("[Login] No user data found in response");
        toast.error("Login failed: No user data received");
        setLoading(false);
        return;
      }
      
      toast.success("Login successful");
      console.log("[Login] Redirecting to dashboard...");
      
      // Force navigation to dashboard with full page reload
      window.location.href = "/";
    } catch (error) {
      console.error("[Login] Login failed:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Map API role or username to app role
  const mapApiRoleToAppRole = (username: string, apiRole: string): string => {
    const usernameToRole: Record<string, string> = {
      "teknisi": "teknisi",
      "kasi": "kasi",
      "kabid": "kabid",
      "diskominfo": "diskominfo",
    };
    
    // First try to map by username
    if (usernameToRole[username.toLowerCase()]) {
      return usernameToRole[username.toLowerCase()];
    }
    
    // Otherwise map by API role
    const roleMap: Record<string, string> = {
      "ADMIN": "diskominfo",
      "TECHNICIAN": "teknisi",
      "KASI": "kasi",
      "KABID": "kabid",
      "DISKOMINFO": "diskominfo",
    };
    
    return roleMap[apiRole.toUpperCase()] || "teknisi";
  };

  const handleForgotPassword = async () => {
    console.log("[Login] Forgot password clicked");
    if (!username) {
      toast.error("Please enter your username/email first");
      return;
    }
    try {
      await api.forgotPassword(username);
      toast.info("Password reset link has been sent to your email.");
    } catch (error) {
      console.error("[Login] Forgot password failed:", error);
      toast.error("Failed to send password reset email.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#384E66" }}
    >
      <div
        className="w-full max-w-md p-8 rounded-lg shadow-lg"
        style={{ backgroundColor: "#FFFFFF" }}
      >

<div className="text-center mb-6">
  <img
    src="/logo-sakti.png"
    alt="SAKTI Logo"
    className="h-20 mx-auto drop-shadow-lg"
  />
  <h1 className="text-2xl font-bold mt-4 text-[#253040]">
    Change & Configuration Management
  </h1>
</div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "#384E66" }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{
                borderColor: "#E5E7EB",
                backgroundColor: "#F9FAFB",
              }}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "#384E66" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full px-4 py-3 pr-12 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: "#E5E7EB",
                  backgroundColor: "#F9FAFB",
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="mb-6 text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm hover:underline"
              style={{ color: "#384E66" }}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            style={{
              backgroundColor: "#2D3E50",
              color: "#FFFFFF",
            }}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p
          className="text-center text-sm mt-6"
          style={{ color: "#6B7280" }}
        >
          © 2025 SAKTI – Pemerintah Kota • All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Login;
