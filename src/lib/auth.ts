// src/lib/auth.ts
// export function isAdminLoggedIn() {
//     if (typeof window === "undefined") return false;

// Note: This will return false if the cookie is set as HttpOnly,
// which is why it's better to check auth status on the server.
//     return document.cookie.includes("admin_token=");
// }

export function getAdminToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("admin_token");
}

export function isAdminLoggedIn() {
    return !!getAdminToken();
}
