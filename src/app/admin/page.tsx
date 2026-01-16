"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Conversation = {
    _id: string;
    visitorName: string;
    status: "open" | "closed";
    createdAt: string;
};

export default function AdminPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/conversations`)
            .then(res => res.json())
            .then(data => setConversations(data));
    }, []);

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Conversations</h1>

            <div className="space-y-3">
                {conversations.map(conv => (
                    <Link
                        key={conv._id}
                        href={`/admin/chat/${conv._id}`}
                        className="block border rounded p-3 hover:bg-muted"
                    >
                        <div className="flex justify-between">
                            <span className="font-medium">{conv.visitorName}</span>
                            <span className={conv.status === "open" ? "text-green-600" : "text-red-500"}>
                                {conv.status}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
