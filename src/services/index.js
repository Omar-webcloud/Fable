import api from "@/lib/axios";

export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  googleLogin: (idToken) => api.post("/auth/google", { idToken }),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/me"),
};

export const userService = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (id, data) => api.put(`/users/${id}`, data),
  getAll: () => api.get("/admin/users"),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  changeRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
};

export const ebookService = {
  getAll: (params) => api.get("/ebooks", { params }),
  getFeatured: () => api.get("/ebooks/featured"),
  getById: (id) => api.get(`/ebooks/${id}`),
  create: (data) => api.post("/ebooks", data),
  update: (id, data) => api.put(`/ebooks/${id}`, data),
  delete: (id) => api.delete(`/ebooks/${id}`),
  publish: (id) => api.patch(`/ebooks/${id}/publish`),
  unpublish: (id) => api.patch(`/ebooks/${id}/unpublish`),
};

export const bookmarkService = {
  getAll: () => api.get("/bookmarks"),
  add: (ebookId) => api.post("/bookmarks", { ebookId }),
  remove: (ebookId) => api.delete(`/bookmarks/${ebookId}`),
};

export const purchaseService = {
  getAll: () => api.get("/purchases"),
  getByUser: () => api.get("/purchases/user"),
};

export const paymentService = {
  createCheckout: (ebookId) => api.post("/payments/checkout", { ebookId }),
  verifyPayment: (sessionId) => api.get(`/payments/verify/${sessionId}`),
};

export const writerService = {
  getTop: () => api.get("/writers/top"),
  getSales: () => api.get("/writers/sales"),
};

export const adminService = {
  getStats: () => api.get("/admin/stats"),
  getTransactions: () => api.get("/admin/transactions"),
  getEbooks: () => api.get("/admin/ebooks"),
};

export const analyticsService = {
  getMonthlySales: () => api.get("/analytics/monthly-sales"),
  getGenreDistribution: () => api.get("/analytics/genre-distribution"),
};
