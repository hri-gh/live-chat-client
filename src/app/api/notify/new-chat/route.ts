// // src/app/api/notify/new-chat/route.ts
// import { resend } from "@/lib/resend";
// import { NextRequest, NextResponse } from "next/server";
// import { sendNewConversationEmail } from "@/helpers/send-new-conversation-email";

// interface RequestBody {
//     visitorName: string;
//     conversationId: string;
// }

// export async function POST(request: NextRequest) {
//     try {
//         const body: RequestBody = await request.json();
//         const { visitorName, conversationId } = body;

//         if (!visitorName || !conversationId) {
//             return NextResponse.json(
//                 { error: "Missing required fields" },
//                 { status: 400 }
//             );
//         }

//         const timestamp = new Date().toLocaleString("en-US", {
//             dateStyle: "full",
//             timeStyle: "short",
//         });

//         // Send email immediately (doesn't wait for backend)
//         const { success, message } = await sendNewConversationEmail(visitorName, conversationId);

//         if (!success) {
//             console.error("Failed to send email:", message);
//             return NextResponse.json(
//                 { success: false, message: message },
//                 { status: 500 }
//             );
//         }

//         return NextResponse.json({ success, message });
//     } catch (error) {
//         console.error("API route error:", error);
//         return NextResponse.json(
//             { error: "Internal server error" },
//             { status: 500 }
//         );
//     }
// }
