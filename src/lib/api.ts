// export async function startConversation() {
//     const res = await fetch(
//         `${process.env.NEXT_PUBLIC_CHAT_URL}/api/conversations/start`,
//         {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 visitorName: "John",
//             }),
//         }
//     );

//     const data = await res.json();
//     return data.conversationId;
// }

// await fetch("http://localhost:8000/api/conversations/start", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//         visitorName: "John",
//     }),
// });

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
