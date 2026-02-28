"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { startConversation } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Message = {
    sender: string;
    content: string;
    createdAt: string;
};

export default function ChatPage() {
    const [name, setName] = useState("");
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState("");
    const [isClosed, setIsClosed] = useState(false);


    // Socket listeners
    useEffect(() => {
        socket.on("message:new", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        socket.on("conversation:error", (err) => {
            console.error(err);
        });

        const onConversationClosed = () => {
            setIsClosed(true);
        };

        socket.on("conversation:closed", onConversationClosed);

        return () => {
            socket.off("conversation:closed", onConversationClosed);
        };
    }, []);

    // Start conversations via API,
    // async function handleStartChat() {
    //     const { conversationId } = await startConversation(name);

    //     localStorage.setItem("conversationId", conversationId);
    //     setConversationId(conversationId);

    //     socket.connect();
    //     socket.emit("conversation:join", { conversationId });
    // }

    //
    function handleStartChat() {
        console.log("button clicked")
        if (!name.trim()) return;

        socket.connect();

        socket.emit("conversation:start", {
            visitorName: name,
        });

        socket.once("conversation:ready", ({ conversationId }) => {
            localStorage.setItem("conversationId", conversationId);
            setConversationId(conversationId);

            socket.emit("conversation:join", { conversationId });
        });
    }

    function sendMessage() {
        if (!text.trim() || !conversationId) return;

        socket.emit("message:send", {
            conversationId,
            content: text,
        });

        setText("");
    }

    return (
        <div className="flex justify-center mt-10">
            <Card className="w-full max-w-md p-4 space-y-4">
                {!conversationId ? (
                    <>
                        <Input
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Button onClick={handleStartChat} disabled={!name}>
                            Start Chat
                        </Button>
                    </>
                ) : (
                    <>
                        <div className="h-64 overflow-y-auto border p-2 rounded">
                            {messages.map((m, i) => (
                                <div key={i} className="mb-1">
                                    <b>{m.sender}:</b> {m.content}
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <Input
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder={isClosed ? "Chat closed by admin" : "Type your message"}
                                disabled={isClosed}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                                className={isClosed ? "bg-gray-200 border p-2 w-full" : ""}
                            />

                            <Button
                                onClick={sendMessage}
                                disabled={isClosed || !text.trim()}
                                className="bg-blue-500 text-white px-4 py-2 disabled:opacity-50"
                            >
                                Send
                            </Button>

                        </div>
                        {isClosed && (
                            <p className="text-sm text-red-500 mt-2 text-center font-bold">
                                This conversation has been closed by the admin.
                            </p>
                        )}
                    </>
                )}
            </Card>
        </div>
    );
}

// "bg-blue-500 text-white px-4 py-2 disabled:opacity-50"
