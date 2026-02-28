import api from "./axios";

export async function adminLogin(email: string, password: string) {
    try {
        const res = await api.post("/api/admin/auth/login", { email, password });
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Login failed");
    }
}

export async function adminLogout() {
    try {
        const res = await api.post("/api/admin/auth/logout");
        return res.data;
    } catch (err: any) {
        throw new Error("Logout failed");
    }
}
