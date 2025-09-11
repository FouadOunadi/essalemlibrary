import { NextResponse } from "next/server";
import { Resend } from 'resend';

export async function POST(request) {
    try {
        console.log('Email API called');
        const body = await request.json();
        console.log('Request body:', body);
        const { customerName, customerPhone, customerNotes, total, items } = body;

        console.log("customerName:", customerName);
        console.log("customerPhone:", customerPhone);
        console.log("customerNotes:", customerNotes);
        console.log("total:", total);
        console.log("items:", items);

        // Validate required fields
        if (!customerName || !customerPhone || !total || !items) {
            console.log('Missing required fields');
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
        console.log('OWNER_EMAIL:', process.env.OWNER_EMAIL);
        
        const resend = new Resend(process.env.RESEND_API_KEY);

        const itemsHtml = items.map(item => {
            const hasPromo = item.hasPromo && item.regularTotal && item.promoTotal && item.regularTotal !== item.promoTotal;
            
            return `
                <tr>
                    <td style="padding: 8px; text-align: right;">
                        <strong>${item.name}</strong>
                        ${hasPromo ? ' 🎁 عرض خاص' : ''}
                    </td>
                    <td style="padding: 8px; text-align: center;">${item.quantity}</td>
                    <td style="padding: 8px; text-align: center;">
                        ${hasPromo ? `
                            <s>${item.regularTotal.toFixed(2)} دج</s><br>
                            <strong>${item.promoTotal.toFixed(2)} دج</strong>
                        ` : `
                            <strong>${(item.price * item.quantity).toFixed(2)} دج</strong>
                        `}
                    </td>
                </tr>
            `;
        }).join('');

        const emailHtml = `
            <div style="font-family: Arial, sans-serif;">
                <h2>طلب جديد من متجر مكتبة السلام</h2> 
                
                <h3>معلومات العميل:</h3>
                <p><strong>الاسم:</strong> ${customerName}</p>
                <p><strong>رقم الهاتف:</strong> ${customerPhone}</p>
                ${customerNotes ? `<p><strong>ملاحظات:</strong> ${customerNotes}</p>` : ''}

                <h3>تفاصيل الطلب:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #4CAF50; color: white;">
                            <th style="padding: 10px; text-align: right;">المنتج</th>
                            <th style="padding: 10px; text-align: center;">الكمية</th>
                            <th style="padding: 10px; text-align: center;">السعر</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                        <tr style="background: #f0f0f0;">
                            <td colspan="2" style="padding: 10px; text-align: right;"><strong>المجموع الكلي:</strong></td>
                            <td style="padding: 10px; text-align: center;"><strong>${total.toFixed(2)} دج</strong></td>
                        </tr>
                    </tbody>
                </table>

                <p>تم إرسال هذا الإيميل تلقائياً من نظام متجر سينونة</p>
            </div>
        `;

        console.log('Attempting to send email...');
        const emailData = {
            from: 'onboarding@resend.dev',
            to: process.env.OWNER_EMAIL || 'ounadifouad@gmail.com',
            subject: `طلب جديد من ${customerName} - متجر سينونة`,
            html: emailHtml
        };
        console.log('Email data:', emailData);
        
        const result = await resend.emails.send(emailData);
        console.log('Email sent successfully:', result);

        return NextResponse.json(
            { message: "Email sent successfully", result },
            { status: 200 }
        );
        
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { 
                message: "Error sending email",
                error: error.message 
            },
            { status: 500 }
        );
    }
}