import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
    try {
        const body = await request.json();
        const { password } = body;

        // Validate required fields
        if (!password) {
            return NextResponse.json(
                { message: "Password is required" },
                { status: 400 }
            );
        }

        // Get admin password from database
        const { data: adminData, error } = await supabase
            .from('admin')
            .select('password')
            .single();

        if (error || !adminData) {
            console.error('Database error:', error);
            return NextResponse.json(
                { message: "Authentication failed" },
                { status: 401 }
            );
        }

        console.log('Input password:', password);
        console.log('Password from database:', adminData.password);
        console.log('Database password length:', adminData.password?.length);
        console.log('Is database password a bcrypt hash?', adminData.password?.startsWith('$2'));

        // Verify password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, adminData.password);
        console.log('Password comparison result:', isPasswordValid);

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Invalid password" },
                { status: 401 }
            );
        }

        // Simple success response
        return NextResponse.json(
            { message: "Authentication successful", success: true },
            { status: 200 }
        );

    } catch (error) {
        console.error('Admin auth error:', error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}