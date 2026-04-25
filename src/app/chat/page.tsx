"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

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

    // Loading states
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionTimer, setConnectionTimer] = useState(0);


    // Socket listeners
    useEffect(() => {
        socket.on("message:new", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        socket.on("conversation:error", (err) => {
            console.error(err);
            setIsConnecting(false);
            setConnectionTimer(0);
        });

        const onConversationClosed = () => {
            setIsClosed(true);
        };

        socket.on("conversation:closed", onConversationClosed);

        // Listen for connection success
        socket.once("conversation:ready", ({ conversationId }) => {
            localStorage.setItem("conversationId", conversationId);
            setConversationId(conversationId);
            setIsConnecting(false);
            setConnectionTimer(0);
            socket.emit("conversation:join", { conversationId });
        });

        return () => {
            socket.off("message:new");
            socket.off("conversation:error");
            socket.off("conversation:closed", onConversationClosed);
            socket.off("conversation:ready");
        };
    }, []);


    // 🔥 NEW: Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isConnecting) {
            interval = setInterval(() => {
                setConnectionTimer((prev) => prev + 1);
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isConnecting]);

    // Start conversations via API,
    // async function handleStartChat() {
    //     const { conversationId } = await startConversation(name);

    //     localStorage.setItem("conversationId", conversationId);
    //     setConversationId(conversationId);

    //     socket.connect();
    //     socket.emit("conversation:join", { conversationId });
    // }

    //
    async function handleStartChat() {
        if (!name.trim()) return;

        setIsConnecting(true);
        setConnectionTimer(0);

        // Send email notification IMMEDIATELY
        // This doesn't wait for the backend to wake up
        // try {
        //     await fetch("/api/notify/new-chat", {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({
        //             visitorName: name,
        //             conversationId: "pending", // Will be updated
        //         }),
        //     });
        //     console.log("✅ Email notification sent");
        // } catch (error) {
        //     console.error("Failed to send email notification:", error);
        //     // Continue anyway - don't block chat
        // }

        socket.connect();

        socket.emit("conversation:start", {
            visitorName: name,
        });

        // socket.once("conversation:ready", ({ conversationId }) => {
        //     localStorage.setItem("conversationId", conversationId);
        //     setConversationId(conversationId);

        //     socket.emit("conversation:join", { conversationId });
        // });
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
                            {isConnecting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                "Start Chat"
                            )}
                        </Button>

                        {/* 🔥 NEW: Loading indicator with timer */}
                        {isConnecting && (
                            <div className="space-y-2 text-center">
                                <div className="text-sm text-muted-foreground">
                                    Connecting to chat server...
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {connectionTimer}s elapsed
                                </div>
                                {connectionTimer > 15 && (
                                    <div className="text-xs text-amber-600">
                                        Server is waking up, this may take up to 30 seconds...
                                    </div>
                                )}
                                {connectionTimer > 30 && (
                                    <div className="text-xs text-red-600">
                                        Taking longer than expected. Please wait or reload the page to try again.
                                    </div>
                                )}
                            </div>
                        )}
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
