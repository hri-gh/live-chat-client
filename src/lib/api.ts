export async function startConversation(visitorName: string) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/conversations/start`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ visitorName }),
        }
    );

    if (!res.ok) {
        throw new Error("Failed to start conversation");
    }

    return res.json(); // { conversationId }
}
