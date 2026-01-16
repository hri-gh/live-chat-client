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

    // Socket listeners
    useEffect(() => {
        socket.on("message:new", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        socket.on("conversation:error", (err) => {
            console.error(err);
        });

        return () => {
            socket.off();
        };
    }, []);

    async function handleStartChat() {
        const { conversationId } = await startConversation(name);

        localStorage.setItem("conversationId", conversationId);
        setConversationId(conversationId);

        socket.connect();
        socket.emit("conversation:join", { conversationId });
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
                                placeholder="Type a message"
                            />
                            <Button onClick={sendMessage}>Send</Button>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}
