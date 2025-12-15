import { API_BASE, getToken } from "./auth";

const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  login: async (username: string, password: string) => {
    console.log("[API] POST /auth/login - Attempting login...");
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      console.error("[API] POST /auth/login - Failed:", res.status);
      throw new Error("Login failed");
    }
    const data = await res.json();
    console.log("[API] POST /auth/login - Success");
    return data;
  },

  forgotPassword: async (email: string) => {
    console.log("[API] POST /auth/forgot-password - Sending reset request...");
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      console.error("[API] POST /auth/forgot-password - Failed:", res.status);
      throw new Error("Forgot password request failed");
    }
    const data = await res.json();
    console.log("[API] POST /auth/forgot-password - Success");
    return data;
  },

  logout: async () => {
    console.log("[API] POST /auth/logout - Logging out...");
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error("[API] POST /auth/logout - Failed:", res.status);
      throw new Error("Logout failed");
    }
    console.log("[API] POST /auth/logout - Success");
    return res.json();
  },

  getProfile: async () => {
    console.log("[API] GET /auth/login - Fetching profile...");
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error("[API] GET /auth/login - Failed:", res.status);
      throw new Error("Failed to fetch profile");
    }
    const data = await res.json();
    console.log("[API] GET /auth/login - Success");
    return data;
  },

  updateProfile: async (profileData: any) => {
    console.log("[API] PUT /auth/login - Updating profile...");
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    if (!res.ok) {
      console.error("[API] PUT /auth/login - Failed:", res.status);
      throw new Error("Failed to update profile");
    }
    const data = await res.json();
    console.log("[API] PUT /auth/login - Success");
    return data;
  },

  // Dashboard
  getDashboardSummary: async () => {
    console.log("[API] GET /dashboard/summary - Fetching dashboard summary...");
    const res = await fetch(`${API_BASE}/dashboard/summary`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error("[API] GET /dashboard/summary - Failed:", res.status);
      throw new Error("Failed to fetch dashboard summary");
    }
    const data = await res.json();
    console.log("[API] GET /dashboard/summary - Success:", data);
    return data;
  },

  getDashboardWeeklyTrend: async () => {
    console.log("[API] GET /dashboard/weekly-trend - Fetching weekly trend...");
    const res = await fetch(`${API_BASE}/dashboard/weekly-trend`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error("[API] GET /dashboard/weekly-trend - Failed:", res.status);
      throw new Error("Failed to fetch weekly trend");
    }
    const data = await res.json();
    console.log("[API] GET /dashboard/weekly-trend - Success:", data);
    return data;
  },

  // Emergency
  getEmergencies: async () => {
    console.log("[API] GET /emergency - Fetching emergencies...");
    const res = await fetch(`${API_BASE}/emergency`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error("[API] GET /emergency - Failed:", res.status);
      throw new Error("Failed to fetch emergencies");
    }
    const data = await res.json();
    console.log("[API] GET /emergency - Success:", data);
    return data;
  },

  getEmergencyById: async (id: string) => {
    console.log(`[API] GET /emergency/${id} - Fetching emergency detail...`);
    const res = await fetch(`${API_BASE}/emergency/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error(`[API] GET /emergency/${id} - Failed:`, res.status);
      throw new Error("Failed to fetch emergency detail");
    }
    const data = await res.json();
    console.log(`[API] GET /emergency/${id} - Success:`, data);
    return data;
  },

  // Change Requests
  getChangeRequests: async () => {
    console.log("[API] GET /change-requests - Fetching change requests...");
    const res = await fetch(`${API_BASE}/change-requests`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error("[API] GET /change-requests - Failed:", res.status);
      throw new Error("Failed to fetch change requests");
    }
    const data = await res.json();
    console.log("[API] GET /change-requests - Success:", data);
    return data;
  },

  getChangeRequestById: async (crId: string) => {
    console.log(`[API] GET /change-requests/${crId} - Fetching change request detail...`);
    const res = await fetch(`${API_BASE}/change-requests/${crId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error(`[API] GET /change-requests/${crId} - Failed:`, res.status);
      throw new Error("Failed to fetch change request detail");
    }
    const data = await res.json();
    console.log(`[API] GET /change-requests/${crId} - Success:`, data);
    return data;
  },

  // Approval
  getApprovalRole: async () => {
    console.log("[API] GET /change-requests/approval-role - Fetching approval role...");
    const res = await fetch(`${API_BASE}/change-requests/approval-role`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error("[API] GET /change-requests/approval-role - Failed:", res.status);
      throw new Error("Failed to fetch approval role");
    }
    const data = await res.json();
    console.log("[API] GET /change-requests/approval-role - Success:", data);
    return data;
  },

  approveChangeRequest: async (crId: string, note: string) => {
    console.log(`[API] POST /change-requests/${crId}/approve - Approving change request...`);
    const res = await fetch(`${API_BASE}/change-requests/${crId}/approve`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ note }),
    });
    if (!res.ok) {
      console.error(`[API] POST /change-requests/${crId}/approve - Failed:`, res.status);
      throw new Error("Failed to approve change request");
    }
    const data = await res.json();
    console.log(`[API] POST /change-requests/${crId}/approve - Success:`, data);
    return data;
  },

  rejectChangeRequest: async (crId: string, note: string) => {
    console.log(`[API] POST /change-requests/${crId}/reject - Rejecting change request...`);
    const res = await fetch(`${API_BASE}/change-requests/${crId}/reject`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ note }),
    });
    if (!res.ok) {
      console.error(`[API] POST /change-requests/${crId}/reject - Failed:`, res.status);
      throw new Error("Failed to reject change request");
    }
    const data = await res.json();
    console.log(`[API] POST /change-requests/${crId}/reject - Success:`, data);
    return data;
  },

  requestRevision: async (crId: string, note: string) => {
    console.log(`[API] POST /change-requests/${crId}/need-info - Requesting revision...`);
    const res = await fetch(`${API_BASE}/change-requests/${crId}/need-info`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ note }),
    });
    if (!res.ok) {
      console.error(`[API] POST /change-requests/${crId}/need-info - Failed:`, res.status);
      throw new Error("Failed to request revision");
    }
    const data = await res.json();
    console.log(`[API] POST /change-requests/${crId}/need-info - Success:`, data);
    return data;
  },

  // Patch Jobs
  getPatchJobs: async () => {
    console.log("[API] GET /patch-jobs - Fetching patch jobs...");
    const res = await fetch(`${API_BASE}/patch-jobs`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error("[API] GET /patch-jobs - Failed:", res.status);
      throw new Error("Failed to fetch patch jobs");
    }
    const data = await res.json();
    console.log("[API] GET /patch-jobs - Success:", data);
    return data;
  },

  createPatchJob: async (patchJobData: any) => {
    console.log("[API] POST /patch-jobs - Creating patch job...");
    const res = await fetch(`${API_BASE}/patch-jobs`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(patchJobData),
    });
    if (!res.ok) {
      console.error("[API] POST /patch-jobs - Failed:", res.status);
      throw new Error("Failed to create patch job");
    }
    const data = await res.json();
    console.log("[API] POST /patch-jobs - Success:", data);
    return data;
  },

  getPatchJobOptions: async () => {
    console.log("[API] GET /patch-jobs/options - Fetching patch job options...");
    const res = await fetch(`${API_BASE}/patch-jobs/options`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error("[API] GET /patch-jobs/options - Failed:", res.status);
      throw new Error("Failed to fetch patch job options");
    }
    const data = await res.json();
    console.log("[API] GET /patch-jobs/options - Success:", data);
    return data;
  },

  getPatchJobById: async (id: string) => {
    console.log(`[API] GET /patch-jobs/${id} - Fetching patch job detail...`);
    const res = await fetch(`${API_BASE}/patch-jobs/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error(`[API] GET /patch-jobs/${id} - Failed:`, res.status);
      throw new Error("Failed to fetch patch job detail");
    }
    const data = await res.json();
    console.log(`[API] GET /patch-jobs/${id} - Success:`, data);
    return data;
  },

  // Patch Schedules
  getPatchSchedules: async () => {
    console.log("[API] GET /patch-schedules - Fetching patch schedules...");
    const res = await fetch(`${API_BASE}/patch-schedules`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error("[API] GET /patch-schedules - Failed:", res.status);
      throw new Error("Failed to fetch patch schedules");
    }
    const data = await res.json();
    console.log("[API] GET /patch-schedules - Success:", data);
    return data;
  },

  // CMDB Assets
  getAssets: async () => {
    console.log("[API] GET /cmdb/assets - Fetching assets...");
    const res = await fetch(`${API_BASE}/cmdb/assets`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error("[API] GET /cmdb/assets - Failed:", res.status);
      throw new Error("Failed to fetch assets");
    }
    const data = await res.json();
    console.log("[API] GET /cmdb/assets - Success:", data);
    return data;
  },

  getAssetsByCategory: async () => {
    console.log("[API] GET /cmdb/assets/category - Fetching assets by category...");
    const res = await fetch(`${API_BASE}/cmdb/assets/category`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error("[API] GET /cmdb/assets/category - Failed:", res.status);
      throw new Error("Failed to fetch assets by category");
    }
    const data = await res.json();
    console.log("[API] GET /cmdb/assets/category - Success:", data);
    return data;
  },

  getAssetsByType: async () => {
    console.log("[API] GET /cmdb/assets/type - Fetching assets by type...");
    const res = await fetch(`${API_BASE}/cmdb/assets/type`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error("[API] GET /cmdb/assets/type - Failed:", res.status);
      throw new Error("Failed to fetch assets by type");
    }
    const data = await res.json();
    console.log("[API] GET /cmdb/assets/type - Success:", data);
    return data;
  },

  getAssetById: async (id: string) => {
    console.log(`[API] GET /cmdb/assets/${id} - Fetching asset detail...`);
    const res = await fetch(`${API_BASE}/cmdb/assets/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error(`[API] GET /cmdb/assets/${id} - Failed:`, res.status);
      throw new Error("Failed to fetch asset detail");
    }
    const data = await res.json();
    console.log(`[API] GET /cmdb/assets/${id} - Success:`, data);
    return data;
  },

  getAssetRelations: async (id: string) => {
    console.log(`[API] GET /cmdb/assets/${id}/relations - Fetching asset relations...`);
    const res = await fetch(`${API_BASE}/cmdb/assets/${id}/relations`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error(`[API] GET /cmdb/assets/${id}/relations - Failed:`, res.status);
      throw new Error("Failed to fetch asset relations");
    }
    const data = await res.json();
    console.log(`[API] GET /cmdb/assets/${id}/relations - Success:`, data);
    return data;
  },

  getAssetHistory: async (id: string) => {
    console.log(`[API] GET /cmdb/assets/${id}/history - Fetching asset history...`);
    const res = await fetch(`${API_BASE}/cmdb/assets/${id}/history`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error(`[API] GET /cmdb/assets/${id}/history - Failed:`, res.status);
      throw new Error("Failed to fetch asset history");
    }
    const data = await res.json();
    console.log(`[API] GET /cmdb/assets/${id}/history - Success:`, data);
    return data;
  },

  getAssetSpecifications: async (id: string) => {
    console.log(`[API] GET /cmdb/assets/${id}/specifications - Fetching asset specifications...`);
    const res = await fetch(`${API_BASE}/cmdb/assets/${id}/specifications`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error(`[API] GET /cmdb/assets/${id}/specifications - Failed:`, res.status);
      throw new Error("Failed to fetch asset specifications");
    }
    const data = await res.json();
    console.log(`[API] GET /cmdb/assets/${id}/specifications - Success:`, data);
    return data;
  },

  updateAsset: async (id: string, assetData: any) => {
    console.log(`[API] PUT /cmdb/assets/${id} - Updating asset...`);
    const res = await fetch(`${API_BASE}/cmdb/assets/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(assetData),
    });
    if (!res.ok) {
      console.error(`[API] PUT /cmdb/assets/${id} - Failed:`, res.status);
      throw new Error("Failed to update asset");
    }
    const data = await res.json();
    console.log(`[API] PUT /cmdb/assets/${id} - Success:`, data);
    return data;
  },

  assignPatchJob: async (id: string) => {
    console.log(`[API] POST /patch-jobs/${id}/assign - Assigning patch job...`);
    const res = await fetch(`${API_BASE}/patch-jobs/${id}/assign`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      console.error(`[API] POST /patch-jobs/${id}/assign - Failed:`, res.status);
      throw new Error("Failed to assign patch job");
    }
    const data = await res.json();
    console.log(`[API] POST /patch-jobs/${id}/assign - Success:`, data);
    return data;
  },
};
