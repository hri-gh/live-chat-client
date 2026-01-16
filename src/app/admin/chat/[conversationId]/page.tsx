"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import React from "react";

type Message = {
    _id?: string;
    sender: "visitor" | "admin";
    content: string;
    createdAt: string;
};

interface PageProps {
    params: Promise<{ conversationId: string }>; // Explicitly type as Promise
}

export default function AdminChatPage({
    params,
}: PageProps) {
    const { conversationId } = React.use(params);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");

    // Fetch history
    useEffect(() => {
        fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/admin/conversations/${conversationId}/messages`
        )
            .then(res => res.json())
            .then(setMessages);
    }, [conversationId]);

    // Socket logic
    useEffect(() => {
        socket.connect();

        socket.emit("admin:join", { conversationId });

        socket.on("message:new", (msg: Message) => {
            setMessages(prev => [...prev, msg]);
        });

        socket.on("conversation:closed", () => {
            alert("Conversation closed");
        });

        return () => {
            socket.off("message:new");
            socket.disconnect();
        };
    }, [conversationId]);

    const sendMessage = () => {
        if (!input.trim()) return;

        socket.emit("admin:message:send", {
            conversationId,
            content: input,
        });

        setInput("");
    };

    return (
        <div className="p-6 max-w-3xl mx-auto flex flex-col h-screen">
            <h1 className="text-xl font-bold mb-4">Admin Chat</h1>

            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`p-2 rounded max-w-xs ${msg.sender === "admin"
                            ? "bg-blue-500 text-white ml-auto"
                            : "bg-muted"
                            }`}
                    >
                        {msg.content}
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="border rounded px-3 py-2 flex-1"
                    placeholder="Type message…"
                />
                <button
                    onClick={sendMessage}
                    className="bg-primary text-white px-4 rounded"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
