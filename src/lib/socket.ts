// src/lib/socket.ts
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_CHAT_URL!;



// let socket: Socket | null = null;

// export function getSocket() {
//     if (!socket) {
//         socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
//             autoConnect: false, // IMPORTANT
//             transports: ["websocket"],
//         });
//     }
//     return socket;
// }

// // 🔹 Visitor connection (no auth)
// export function connectVisitorSocket() {
//     const socket = getSocket();
//     socket.auth = {}; // no token
//     socket.connect();
//     return socket;
// }

// // 🔹 Admin connection (WITH auth)
// export function connectAdminSocket(token: string) {
//     const socket = getSocket();

//     socket.auth = {
//         role: "admin",
//         token,
//     };

//     socket.connect();
//     return socket;
// }

export const socket: Socket = io(SOCKET_URL, {
    // auth: (cb) => {
    //     const token = typeof document !== "undefined"
    //         ? document.cookie
    //             .split("; ")
    //             .find(c => c.startsWith("admin_token="))
    //             ?.split("=")[1]
    //         : undefined;
    //     cb({ token });
    // },
    // withCredentials: true,
    autoConnect: false,
    transports: ["websocket"],
});


