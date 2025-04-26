import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL;

export async function POST(req) {
    try {
        const { email, subject, message } = await req.json();

        const htmlContent = `
            <h1>${subject}</h1>
            <p>Thank you for contacting us!</p>
            <p>New message submitted:</p>
            <p>${message}</p>
        `;

        const data = await resend.emails.send({
            from: fromEmail,
            to: [email, fromEmail],
            subject: subject,
            html: htmlContent,
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message });
    }
}
