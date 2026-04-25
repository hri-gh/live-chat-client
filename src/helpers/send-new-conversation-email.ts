import { resend } from "@/lib/resend";

export async function sendNewConversationEmail(visitorName: string, conversationId: string) {
    try {
        const timestamp = new Date().toLocaleString("en-US", {
            dateStyle: "full",
            timeStyle: "short",
        });

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: [process.env.ADMIN_EMAIL!],
            subject: `🔔 New Chat: ${visitorName}`,
            // react: NewConversationEmail({ visitorName, conversationId, timestamp }),
            html: `
           <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Chat</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 0; text-align: center;">
                <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px;">
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px;">💬 New Chat Started</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px; color: #333333;">Someone started a conversation!</h2>
                            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 30px 0;">
                                <p style="margin: 0 0 10px; color: #333333;"><strong>Visitor Name:</strong></p>
                                <p style="margin: 0 0 20px; color: #667eea; font-size: 18px; font-weight: bold;">${visitorName}</p>
                                <p style="margin: 0 0 10px; color: #333333;"><strong>Time:</strong></p>
                                <p style="margin: 0; color: #666666;">${timestamp}</p>
                            </div>
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="${process.env.NEXT_PUBLIC_ADMIN_CHAT_URL}/chats"
                                           style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                                            Open Chat Admin
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
            `,
        });
        return { success: true, message: "Email sent successfully" }
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, message: 'Failed to send email.' };
    }
}
