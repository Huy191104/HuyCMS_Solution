import axios from "axios";

const API_URL = "https://localhost:7290/api/auth";

const authService = {

    // ── REGISTER ──────────────────────────────
    register: async (data) => {
        const res = await axios.post(`${API_URL}/register`, data);
        return res.data;
    },

    // ── LOGIN ─────────────────────────────────
    login: async (data) => {
        const res = await axios.post(`${API_URL}/login`, data);
        const { token, customer } = res.data;
        // Lưu token và thông tin user vào localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("customer", JSON.stringify(customer));
        return res.data;
    },

    // ── LOGOUT ────────────────────────────────
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("customer");
    },

    // ── GET CURRENT USER ──────────────────────
    getCurrentUser: () => {
        const customer = localStorage.getItem("customer");
        return customer ? JSON.parse(customer) : null;
    },

    // ── CHECK LOGGED IN ───────────────────────
    isLoggedIn: () => {
        return !!localStorage.getItem("token");
    },

    // ── FORGOT PASSWORD ─────────────────────
    forgotPassword: async (email) => {
        const res = await axios.post(`${API_URL}/forgot-password`, { email });
        return res.data;
    },

    // ── RESET PASSWORD ─────────────────────
    resetPassword: async (token, newPassword, confirmPassword) => {
        const res = await axios.post(`${API_URL}/reset-password`, {
            token,
            newPassword,
            confirmPassword,
        });
        return res.data;
    },

    // ── GET TOKEN ─────────────────────────────
    getToken: () => {
        return localStorage.getItem("token");
    },
};

export default authService;
