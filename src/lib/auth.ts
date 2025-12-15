export const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://api.example.com";

export type UserRole = "teknisi" | "kasi" | "kabid" | "diskominfo";

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  instansi: string;
}

export const getMenuItemsByRole = (role: UserRole) => {
  switch (role) {
    case "teknisi":
      return [
        { name: "Dashboard", path: "/" },
        { name: "Emergency", path: "/emergency" },
        {
          name: "Change Management",
          subItems: [
            { name: "Change Request", path: "/change-request" },
            { name: "Schedule", path: "/change-schedule" },
            { name: "Change Results", path: "/change-results" },
          ],
        },
        {
          name: "Patch Management",
          subItems: [
            { name: "Patch Job", path: "/patch-job" },
            { name: "Schedule", path: "/patch-schedule" },
            { name: "Patch Results", path: "/patch-results" },
          ],
        },
        { name: "CMDB", path: "/cmdb" },
      ];
    case "kasi":
      return [
        { name: "Dashboard", path: "/" },
        { name: "Approval", path: "/approval" },
        { name: "CMDB", path: "/cmdb" },
      ];
    case "kabid":
      return [
        { name: "Dashboard", path: "/" },
        { name: "Approval", path: "/approval" },
        { name: "CMDB", path: "/cmdb" },
      ];
    case "diskominfo":
      return [
        { name: "Dashboard", path: "/" },
        { name: "Approval", path: "/approval" },
        { name: "Patch Job", path: "/patch-job" },
        { name: "CMDB", path: "/cmdb" },
      ];
    default:
      return [];
  }
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const isAuthenticated = (): boolean => {
  return !!getToken() && !!getUser();
};

export const logout = () => {
  localStorage.clear();
};
